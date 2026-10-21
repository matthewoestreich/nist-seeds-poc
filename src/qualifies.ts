import { createHash } from "node:crypto";
import PariGP from "./PariGP.ts";
import PersistentFileRW from "./PersistentFileRW.ts";
import type { OrderCache } from "./types.ts";
import { SEED_BITS, SEED_BYTES, SEED_MODULUS } from "./constants.ts";

export default async function qualifiesSeed(
  p: bigint,
  seed: bigint,
  parigp: PariGP,
  orderCache?: OrderCache,
  cacher?: PersistentFileRW,
): Promise<boolean> {
  const bits = p.toString(2).length;
  const c = hashSeed(seed, bits);

  // Reject a zero discriminant.
  if (c === 0n || mod(4n * c + 27n, p) === 0n) {
    return false;
  }

  // b² ≡ -27/c (mod p).
  const inverse = modPow(c, p - 2n, p);
  const bSquared = mod(-27n * inverse, p);
  const root = modSqrt(bSquared, p);

  if (root === null) {
    return false;
  }

  const n = await curveOrder(p, root, parigp, orderCache, cacher);

  return suitableOrder(p, n);
}

function mod(a: bigint, m: bigint): bigint {
  return ((a % m) + m) % m;
}

function modPow(base: bigint, exp: bigint, p: bigint): bigint {
  let result = 1n;
  base = mod(base, p);

  while (exp > 0n) {
    if (exp & 1n) {
      result = (result * base) % p;
    }
    base = (base * base) % p;
    exp >>= 1n;
  }

  return result;
}

function sha1(data: Uint8Array): bigint {
  const digest = createHash("sha1").update(data).digest("hex");
  return BigInt(`0x${digest}`);
}

function bigintToSeed(value: bigint): Buffer {
  const hex = value.toString(16).padStart(SEED_BYTES * 2, "0");
  return Buffer.from(hex, "hex");
}

// SP 800-186 Appendix C.3.2, Steps 1–6.
function hashSeed(seed: bigint, bits: number): bigint {
  const seedHex = bigintToSeed(seed);
  const v = Math.floor((bits - 1) / 160);
  const w = bits - 160 * v - 1;

  let c = sha1(seedHex) & ((1n << BigInt(w)) - 1n);

  for (let i = 1; i <= v; i++) {
    const si = (seed + BigInt(i)) % SEED_MODULUS;
    const hi = sha1(bigintToSeed(si));
    c = (c << SEED_BITS) | hi;
  }

  return c;
}

// Tonelli–Shanks: returns a square root modulo p, or null.
function modSqrt(n: bigint, p: bigint): bigint | null {
  n = mod(n, p);

  if (n === 0n) {
    return 0n;
  }
  if (p === 2n) {
    return n;
  }
  if (modPow(n, (p - 1n) / 2n, p) !== 1n) {
    return null;
  }
  if (p % 4n === 3n) {
    const root = modPow(n, (p + 1n) / 4n, p);
    return (root * root) % p === n ? root : null;
  }

  let q = p - 1n;
  let s = 0;

  while (q % 2n === 0n) {
    q >>= 1n;
    s++;
  }

  let z = 2n;
  while (modPow(z, (p - 1n) / 2n, p) !== p - 1n) {
    z++;
  }

  let c = modPow(z, q, p);
  let x = modPow(n, (q + 1n) / 2n, p);
  let t = modPow(n, q, p);
  let m = s;

  while (t !== 1n) {
    let i = 0;
    let temp = t;

    do {
      temp = (temp * temp) % p;
      i++;
    } while (temp !== 1n && i < m);

    if (i === m) {
      return null;
    }

    const b = modPow(c, 1n << BigInt(m - i - 1), p);

    x = (x * b) % p;
    c = (b * b) % p;
    t = (t * c) % p;
    m = i;
  }

  return x;
}

// Go's ProbablyPrime(20), approximated with 20 Miller–Rabin bases.
function isProbablyPrime(n: bigint): boolean {
  if (n < 2n) {
    return false;
  }

  const bases = [
    2n,
    3n,
    5n,
    7n,
    11n,
    13n,
    17n,
    19n,
    23n,
    29n,
    31n,
    37n,
    41n,
    43n,
    47n,
    53n,
    59n,
    61n,
    67n,
    71n,
  ];

  for (const p of bases) {
    if (n === p) {
      return true;
    }
    if (n % p === 0n) {
      return false;
    }
  }

  let d = n - 1n;
  let s = 0;

  while (d % 2n === 0n) {
    d >>= 1n;
    s++;
  }

  for (const base of bases) {
    let x = modPow(base, d, n);
    if (x === 1n || x === n - 1n) {
      continue;
    }

    let passed = false;

    for (let r = 1; r < s; r++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        passed = true;
        break;
      }
    }

    if (!passed) {
      return false;
    }
  }

  return true;
}

// Uses PARI/GP's SEA implementation.
async function curveOrder(
  p: bigint,
  b: bigint,
  parigp: PariGP,
  orderCache?: OrderCache,
  cacher?: PersistentFileRW,
): Promise<bigint> {
  // Cache hit
  if (orderCache !== undefined) {
    try {
      const key = `${p.toString(16)} ${b.toString(16)}`;
      const value = orderCache[key];
      if (value && value !== "") {
        return Promise.resolve(BigInt(`0x${value}`));
      }
    } catch (err: unknown) {
      return Promise.reject(
        `Error in curveOrder while reading cache ${(err as Error).message}`,
      );
    }
  }

  // Cache miss : Generate curve order via pari/gp
  try {
    const order = await parigp.curveOrder(p, b);
    if (cacher !== undefined) {
      cacheOrder(cacher, p, b, order);
    }
    return Promise.resolve(order);
  } catch (err: unknown) {
    return Promise.reject(`Error in curveOrder : ${(err as Error).message}`);
  }
}

async function cacheOrder(
  cacher: PersistentFileRW,
  p: bigint,
  b: bigint,
  n: bigint,
): Promise<void> {
  const key = `${p.toString(16)} ${b.toString(16)}`;
  const value = `${n.toString(16)}`;

  try {
    return cacher.appendLine(`${key} ${value}`);
  } catch (err: unknown) {
    return Promise.reject(`Error caching order! ${(err as Error).message}`);
  }
}

// SP 800-186 Appendix C.2.1.1 and C.1.
function suitableOrder(p: bigint, n: bigint): boolean {
  if (n <= 0n || !isProbablyPrime(n)) {
    return false;
  }
  if (n.toString(2).length > p.toString(2).length) {
    return false;
  }

  let pk = 1n;
  // Reject if p^k ≡ 1 (mod n) for any 1 <= k < 1024.
  for (let k = 1; k < 1024; k++) {
    pk = (pk * p) % n;
    if (pk === 1n) {
      return false;
    }
  }

  return true;
}
