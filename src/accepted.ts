#!/usr/bin/env node

import { parseArgs } from "node:util";
import PariGP from "./PariGP.ts";
import qualifiesSeed from "./qualifies.ts";

/**
 * This script REQUIRES that PARI/GP is installed and available as `gp` in your `PATH`. See README for more info!
 * This script checks if a "NIST-like" seed would be accepted by the NIST acceptance criteria, as defined in the README.
 *
 * JAVASCRIPT USAGE:
 * `node dist/accepted.js --generated-seed 3045AE6FC8422F64ED579528D38120EAE12196D5 --prime-field 6277101735386680763835789423207666416083908700390324961279`
 * The line below is equivalent to the line above, using shorthand args.
 * `node dist/accepted.js -s 3045AE6FC8422F64ED579528D38120EAE12196D5 -p 6277101735386680763835789423207666416083908700390324961279`
 *
 * TYPESCRIPT USAGE:
 * `node src/accepted.ts --generated-seed 3045AE6FC8422F64ED579528D38120EAE12196D5 --prime-field 6277101735386680763835789423207666416083908700390324961279`
 * The line below is equivalent to the line above, using shorthand args.
 * `node src/accepted.ts -s 3045AE6FC8422F64ED579528D38120EAE12196D5 -p 6277101735386680763835789423207666416083908700390324961279`
 */

type Arguments = {
  "generated-seed": string;
  "prime-field": string;
  generatedSeed?: string;
  primeField?: string;
  help?: boolean;
};

type ParsedArgs = {
  positionals: any[];
  values: Arguments;
};

const { values } = parseArgs({
  options: {
    "generated-seed": { type: "string", short: "s" },
    "prime-field": { type: "string", short: "p" },
    help: { type: "boolean", short: "h" },
  },
  strict: true,
  allowPositionals: false,
}) as ParsedArgs;

values.generatedSeed = values["generated-seed"];
values.primeField = values["prime-field"];

// If `--help` was provided, or no args provided, print help and exit.
if (values.help || Object.values(values).length === 0) {
  printHelp();
  process.exit(0);
}

// Check for required params
if (!values.generatedSeed || !values.primeField) {
  printHelp();
  throw new Error("[ERROR] Missing required argument!");
}

const generatedSeed = cleanHex(values.generatedSeed);
const primeField = BigInt(values.primeField);

// Validate generated-seed arg
if (!isNistLikeSeed(generatedSeed)) {
  throw new Error(
    "[ERROR] '--generated-seed', or '-s', does not appear to be a 'NIST-like' generated seed. Use 'generate' script to create NIST-like seeds!",
  );
}

// Validate prime-field arg
if (!isAcceptablePrimeField(primeField)) {
  throw new Error(
    "[ERROR] '--prime-field', or '-p', is not acceptable! Prime fields cannot be even numbers!",
  );
}

const parigp = new PariGP();

const isAccepted = await qualifiesSeed(
  primeField,
  BigInt(generatedSeed),
  parigp,
);

console.log(`seed  : ${values.generatedSeed}\nprime : ${values.primeField}`);

if (isAccepted) {
  console.log(
    `[ACCEPTED] Seed and prime field combination meets NIST acceptance criteria`,
  );
} else {
  console.log(
    `[REJECTED] Seed and prime field combination does NOT meet NIST acceptance criteria!`,
  );
}

parigp.close();
process.exit(0);

function cleanHex(hexString: string): string {
  return hexString.startsWith("0x") ? hexString : `0x${hexString}`;
}

// For now we just make sure the hex string is 40 chars long and can be converted into a bigint
function isNistLikeSeed(hexString: string): boolean {
  const cleanedHex = cleanHex(hexString);
  const expectedLength = 40;
  // Need to add 2 to account for the "0x" prefix
  const isExpectedLength = cleanedHex.length === expectedLength + 2;
  if (!isExpectedLength) {
    return false;
  }

  // If we can't convert into a bigint then its not valid hex.
  let isConvertToBigInt = true;
  try {
    BigInt(cleanedHex);
  } catch (_err: unknown) {
    isConvertToBigInt = false;
  }
  if (!isConvertToBigInt) {
    return false;
  }

  return true;
}

function isAcceptablePrimeField(primeField: bigint): boolean {
  return primeField > 0n && primeField % 2n !== 0n;
}

// @ts-ignore
function hexStringToBinaryString(hexString: string): string {
  const cleanedHex = cleanHex(hexString);
  const bi = BigInt(cleanedHex);
  const binary = bi.toString(2);
  const bitLength = binary.length;
  // Pad the binary string to match bit length of input.
  const paddedBinary = binary.padStart(bitLength, "0");
  // Group binary string into bytes, e.g. 00110001 10101001 00101110 11100010 ...
  return paddedBinary.match(/.{1,8}/g)?.join(" ") || "";
}

function printHelp(): void {
  const helpMessage = `
Usage (TypeScript source, Node v22.18.0 or later): 
  node src/accepted.ts [options]
Usage (JavaScript, after compiling):
  npm run build
  node dist/accepted.js [options]

Options:
  -s, --generated-seed <seed>   Generated seed to verify (hexadecimal)
                                We recommend to use output of "generate" script
  -p, --prime-field <prime>     Prime field modulus (positive ODD number)
                                Cannot be an even number!
                                Choose an arbitrary integer, or use a prime field from "src/streams.ts"
  -h, --help                    Display this help message

Examples (TypeScript):
  node src/accepted.ts -s E43BB460F0B80CC0C0B075798E948060F8321B7D -p 123456789123456789
  node src/accepted.ts --generated-seed E43BB460F0B80CC0C0B075798E948060F8321B7D --prime-field 123456789123456789
  node src/accepted.ts -h
  node src/accepted.ts --help

Examples (JavaScript):
  npm run build # Project must be compiled first!
  node dist/accepted.js -s E43BB460F0B80CC0C0B075798E948060F8321B7D -p 123456789123456789
  node dist/accepted.js --generated-seed E43BB460F0B80CC0C0B075798E948060F8321B7D --prime-field 123456789123456789
  node dist/accepted.js -h
  node dist/accepted.js --help

Notes:
  - The "generated-seed" must be a 160-bit value represented by 40 hexadecimal characters.
  - The prime field must be specified as a positive integer.
`.trim();

  console.log(helpMessage);
}
