export default class Rand48 {
  // LCG multiplier used by the drand48 algorithm.
  private static readonly MULTIPLIER = 0x5deece66dn;
  // LCG increment used by the drand48 algorithm.
  private static readonly INCREMENT = 0xbn;
  // Mask to retain the lower 48 bits of the state.
  private static readonly STATE_MASK = (1n << 48n) - 1n;
  // Divisor to normalize the state to a value in [0, 1).
  private static readonly SCALE = 2 ** 48;
  // Number of bits to shift the seed left during initialization.
  private static readonly SEED_SHIFT = 16n;
  // Fixed lower 16 bits appended to the seed during initialization.
  private static readonly INITIAL_STATE_SUFFIX = 0x330en;
  // Number of bits to shift right to extract the upper 31 bits.
  private static readonly OUTPUT_SHIFT = 17n;
  // Mask to retain the lower 32 bits of the seed.
  private static readonly SEED_MASK = 0xffffffffn;

  private state = 0n;
  private seed = 0n;

  // If a seed is provided, we use it to initialize the PRNG via `srand48`
  constructor(seed?: bigint) {
    if (seed !== undefined) {
      this.srand48(seed);
    }
  }

  // Initialization function
  srand48(seed: bigint): void {
    this.seed = seed;
    this.state =
      ((this.seed & Rand48.SEED_MASK) << Rand48.SEED_SHIFT) |
      Rand48.INITIAL_STATE_SUFFIX;
  }

  drand48(): number {
    this.advanceState();
    return Number(this.state) / Rand48.SCALE;
  }

  lrand48(): number {
    this.advanceState();
    return Number(this.state >> Rand48.OUTPUT_SHIFT);
  }

  private advanceState(): void {
    this.state =
      (Rand48.MULTIPLIER * this.state + Rand48.INCREMENT) & Rand48.STATE_MASK;
  }
}
