# ECDSA Curve Origins

Anthropic's research into the origins of the NIST elliptic curves has renewed interest in how their parameters were generated. This proof of concept explores the possibility of reconstructing the original seeds by searching the `rand48` family of pseudorandom number generators, using suspected generation timestamps to narrow the search.

The goal is to reproduce the original seeds and verify them against the published curve parameters and the applicable NIST acceptance criteria.

## Sources

### Articles and Implementations

- [Anthropic: ECDSA Curve Origins](https://www.anthropic.com/research/ecdsa-curve-origins)
- [Filippo Valsorda: Seeds Solved](https://words.filippo.io/seeds-solved/)
- [Filippo Valsorda's proof of concept](https://github.com/FiloSottile/mostly-harmless/blob/main/seeds/seeds.go)

### Seed Acceptance Criteria

The speculative seed validation process draws on the procedures specified in NIST SP 800-186, Appendix C.3.1 and C.3.2, as implemented in Filippo Valsorda’s reference code. Their applicability to the hypothesized seed-generation process remains an assumption rather than an established fact.

> Command seeds implements the generation and verification of the NIST pseudorandom prime curves P-192, P-224, P-256, P-384, and P-521 from their domain parameter seeds, as specified in SP 800-186 Appendix C.3.1 and C.3.2.
>
> — Filippo Valsorda

- [NIST SP 800-186](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-186.pdf)

> The same procedures appear in FIPS 186-4 Appendix D.5 and D.6 and in FIPS 186-2 Appendix 6.4 and 6.5, and originate from ANSI X9.62-1998 Annex A.3.3.2 and A.3.4.2, which allow seeds longer than 160 bits and apply the curve acceptance criteria of Annex A.3.2. All NIST pseudorandom prime curves use a = -3, SHA-1, and a 160-bit seed, which this package hardcodes.
>
> — Filippo Valsorda

- [NIST FIPS 186-4](https://csrc.nist.gov/pubs/fips/186-4/final)
- [ANSI X9.62-1998](https://safecurves.cr.yp.to/grouper.ieee.org/groups/1363/private/x9-62-09-20-98.pdf)

# Prerequisites

- **Node.js `22.18.0+`** — Required to run the TypeScript source files directly. Alternatively, compile the project to JavaScript and run the generated files.

- **[PARI/GP](https://pari.math.u-bordeaux.fr/)** — ❗ Required **only if `orders_cache.txt` is missing** and is only needed for running the `search` script. **Keeping the cache (or not running the `search` script) avoids the need to install PARI/GP.**

## Install npm Dependencies

From the project root, run:

```bash
npm install
```

## Install PARI/GP

❗ ***NOTE:** PARI/GP is only required if you want to run the `search` script and have removed the cached elliptic-curve orders, `orders_cache.txt`, at the root of this repository! **Keeping the cache (or not running the `search` script) avoids the need to install PARI/GP.**

To run the `search` script, install [PARI/GP](https://pari.math.u-bordeaux.fr/) and ensure its `gp` executable is available in your `PATH`.

- [Download PARI/GP](https://pari.math.u-bordeaux.fr/download.html)
- macOS with Homebrew: `brew install pari`

# Scripts

## Search for Candidate Seeds

Search for candidate seeds that satisfy the [seed acceptance criteria](#seed-acceptance-criteria).

**IMPORTANT:** The search uses cached elliptic-curve orders (`orders_cache.txt`) to reduce computation time. Without this cache, you will need to install PARI/GP, and the search may take around an hour because calculating the number of points on each candidate curve is computationally expensive.

With Node.js `v22.18.0` or later:

```bash
node src/search.ts
```

Alternatively, compile the project and run the generated JavaScript:

```bash
npm run build
node dist/search.js
```

**Note:** This script requires PARI/GP to be installed and accessible through `PATH`.

### Expected Output

```bash
srand48(863711343) [1997-05-15 15:49:03 +0000 UTC]
  accepted but skipped     36th seed 25E56088185F8C3207B166CD2E007B88276AFE78
  accepted but skipped   1562nd seed D09BFB7DB85672DC700269F9189983F25F81958D
  accepted and published 2185th seed E43BB460F0B80CC0C0B075798E948060F8321B7D as 'prime239v1'
  accepted and published 2320th seed E8B4011604095303CA3B8099982BE09FCB9AE616 as 'prime239v2'
  accepted but skipped   2491st seed 1256FDD46EEB96B7D312DDB1DE99BFF159CF6701
  accepted but skipped   2682nd seed D2C18E22558203444A2B33EA97C178675B438484
  accepted but skipped   2863rd seed 3A700D3E6BF03255949804BA2A8677550C19EE11
  accepted and published 3048th seed 7D7374168FFE3471B60A857686A19475D3BFA2FF as 'prime239v3'
srand48(863966734) [1997-05-18 14:45:34 +0000 UTC]
  accepted and published  139th seed 3045AE6FC8422F64ED579528D38120EAE12196D5 as 'P-192'
  accepted but skipped   2198th seed 692D90186057951DE011733105BF1B3D3B0FC451
  accepted and published 5228th seed C469684435DEB378C4B65CA9591E2A5763059A2E as 'prime192v3'
  accepted but skipped   5405th seed 3AD10FF61797BC7258480CADD4E59C1AC1FB66D1
  accepted and published 6013th seed 31A92EE2029FD10D901B113E990710F0D21AC6B6 as 'prime192v2'
srand48(871002724) [1997-08-08 01:12:04 +0000 UTC]
  accepted and published 1136th seed D09E8800291CB85396CC6717393284AAA0DA64BA as 'P-521'
srand48(871696354) [1997-08-16 01:52:34 +0000 UTC]
  accepted but skipped    876th seed 50C71A63F911DB7B2F31618ECF609D37154437F9
  accepted and published 1842nd seed C49D360886E704936A6678E1139D26B7819F7E90 as 'P-256'
srand48(872952608) [1997-08-30 14:50:08 +0000 UTC]
  accepted and published 2688th seed A335926AA319A27A1D00896A6773A4827ACDAC73 as 'P-384'
srand48(891607927) [1998-04-03 12:52:07 +0000 UTC]
  accepted but skipped    777th seed D00720E7691D403449C0D91BE84BFB2C7501A267
  accepted but skipped   1485th seed 18CFDBCBB825568171212BC1610A5B8A8004E5C4
  accepted but skipped   5736th seed 3C170A30EE6709DF9B4C9EA0B6C1E95FCD6200CE
  accepted and published 7026th seed BD71344799D5C7FCDC45B59FA3B9AB8F6A948BC5 as 'P-224'
```

## Reconstruct Seeds

Run the reconstruction script to test the suspected generation timestamps and compare the reconstructed seeds against the expected values.

With Node.js `v22.18.0` or later:

```bash
node src/reconstruct.ts
```

Alternatively, compile the project and run the generated JavaScript:

```bash
npm run build
node dist/reconstruct.js
```

### Expected Output

A successful run should produce a table similar to the following. The `publishedSeed` column contains the reference seed, `calculatedSeed` contains the reconstructed seed, and `isAccurate` indicates whether they match.

```bash
┌─────────┬──────────────┬──────────────────────────┬───────────┬────────────────────────────────────────────┬────────────────────────────────────────────┬────────────┐
│ (index) │ name         │ date                     │ timestamp │ publishedSeed                              │ calculatedSeed                             │ isAccurate │
├─────────┼──────────────┼──────────────────────────┼───────────┼────────────────────────────────────────────┼────────────────────────────────────────────┼────────────┤
│ 0       │ 'prime239v1' │ 1997-05-15T15:49:03.000Z │ 863711343 │ 'E43BB460F0B80CC0C0B075798E948060F8321B7D' │ 'E43BB460F0B80CC0C0B075798E948060F8321B7D' │ true       │
│ 1       │ 'prime239v2' │ 1997-05-15T15:49:03.000Z │ 863711343 │ 'E8B4011604095303CA3B8099982BE09FCB9AE616' │ 'E8B4011604095303CA3B8099982BE09FCB9AE616' │ true       │
│ 2       │ 'prime239v3' │ 1997-05-15T15:49:03.000Z │ 863711343 │ '7D7374168FFE3471B60A857686A19475D3BFA2FF' │ '7D7374168FFE3471B60A857686A19475D3BFA2FF' │ true       │
│ 3       │ 'P-192'      │ 1997-05-18T14:45:34.000Z │ 863966734 │ '3045AE6FC8422F64ED579528D38120EAE12196D5' │ '3045AE6FC8422F64ED579528D38120EAE12196D5' │ true       │
│ 4       │ 'prime192v3' │ 1997-05-18T14:45:34.000Z │ 863966734 │ 'C469684435DEB378C4B65CA9591E2A5763059A2E' │ 'C469684435DEB378C4B65CA9591E2A5763059A2E' │ true       │
│ 5       │ 'prime192v2' │ 1997-05-18T14:45:34.000Z │ 863966734 │ '31A92EE2029FD10D901B113E990710F0D21AC6B6' │ '31A92EE2029FD10D901B113E990710F0D21AC6B6' │ true       │
│ 6       │ 'P-521'      │ 1997-08-08T01:12:04.000Z │ 871002724 │ 'D09E8800291CB85396CC6717393284AAA0DA64BA' │ 'D09E8800291CB85396CC6717393284AAA0DA64BA' │ true       │
│ 7       │ 'P-256'      │ 1997-08-16T01:52:34.000Z │ 871696354 │ 'C49D360886E704936A6678E1139D26B7819F7E90' │ 'C49D360886E704936A6678E1139D26B7819F7E90' │ true       │
│ 8       │ 'P-384'      │ 1997-08-30T14:50:08.000Z │ 872952608 │ 'A335926AA319A27A1D00896A6773A4827ACDAC73' │ 'A335926AA319A27A1D00896A6773A4827ACDAC73' │ true       │
│ 9       │ 'P-224'      │ 1998-04-03T12:52:07.000Z │ 891607927 │ 'BD71344799D5C7FCDC45B59FA3B9AB8F6A948BC5' │ 'BD71344799D5C7FCDC45B59FA3B9AB8F6A948BC5' │ true       │
│ 10      │ 'B-233'      │ 1998-04-17T15:24:18.000Z │ 892826658 │ '74D59FF07F6B413D0EA14B344B20A2DB049B50C3' │ '74D59FF07F6B413D0EA14B344B20A2DB049B50C3' │ true       │
│ 11      │ 'B-283'      │ 1998-04-17T15:27:44.000Z │ 892826864 │ '77E2B07370EB0F832A6DD5B62DFC88CD06BB84BE' │ '77E2B07370EB0F832A6DD5B62DFC88CD06BB84BE' │ true       │
│ 12      │ 'B-409'      │ 1998-04-17T15:30:18.000Z │ 892827018 │ '4099B5A457F9D69F79213D094C4BCD4D4262210B' │ '4099B5A457F9D69F79213D094C4BCD4D4262210B' │ true       │
│ 13      │ 'B-571'      │ 1998-04-17T15:32:08.000Z │ 892827128 │ '2AA058F73A0E33AB486B0F610410C53A7F132310' │ '2AA058F73A0E33AB486B0F610410C53A7F132310' │ true       │
└─────────┴──────────────┴──────────────────────────┴───────────┴────────────────────────────────────────────┴────────────────────────────────────────────┴────────────┘
```

## Generate N Seeds

The `generate` script lets you experiment with seed generation by specifying the number of seeds to generate, the `rand48` initial seed, and the extraction method (`prime` or `binary`).

**Run the TypeScript source directly** (Node.js `v22.18.0` or later):

```bash
node src/generate.ts --n 1000 --rand48seed 123456789 --kind prime
```

Alternatively, compile the project and run the generated JavaScript:

```bash
npm run build
node dist/generate.js --n 1000 --rand48seed 123456789 --kind prime
```

### Example: Using the Current Unix Timestamp

NIST's seed-generation procedure used the current Unix timestamp to initialize `rand48`. The following examples use the same approach by passing the current timestamp as `--rand48seed`.

**Run the TypeScript source directly:**

```bash
node src/generate.ts --n 10 --rand48seed "$(date +%s)" --kind prime
```

**Run the compiled JavaScript:**

```bash
npm run build
node dist/generate.js --n 10 --rand48seed "$(date +%s)" --kind prime
```

Replace `prime` with `binary` to experiment with the alternative extraction method.

#### Sample Output

```bash
854598AC118D5C96D7391010250603F7E1C3A438
F70804FCE0FC963847853D18DB30F530A039EEE9
17A136BB4368E55B27D60813B8D25411A98B29C6
42C2B407CFDF97B890100B723F830148FA35F583
A1ED06588C3AD7E57B24B319F9F02C7B9B98C785
2B47271259B05BA9F3ACA39A76F403D0BA6719A3
3BABCC24A38055C4B992642DDB65ACDCBAAA4034
15A1C71C14A3D27A60237CF6773BBCE08A6FC25F
D218759B4A9786DC8AD9052E44611240B1065C20
C81CB72F4D442D7CD7A8A8D86F918A6195F34BB3
```
