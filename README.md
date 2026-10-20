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

# Usage

## Prerequisites

**Node.js:** Version `22.18.0` or later is required to run the TypeScript source files directly. Alternatively, you can compile the project and run the generated JavaScript files.

**PARI/GP:** Required only for the seed-search script.

### Install PARI/GP

To run the `search` script, install [PARI/GP](https://pari.math.u-bordeaux.fr/) and ensure its `gp` executable is available in your `PATH`.

- [Download PARI/GP](https://pari.math.u-bordeaux.fr/download.html)
- macOS with Homebrew: `brew install pari`

### Install npm Dependencies

From the project root, run:

```bash
npm install
```

## Scripts

### Search for Candidate Seeds

Search for candidate seeds that satisfy the [seed acceptance criteria](#seed-acceptance-criteria).

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

### Reconstruct Seeds

Run the reconstruction script to test the suspected generation timestamps and compare the reconstructed seeds against the expected values.

With Node.js `v22.18.0` or later:

```bash
node src/reconstructSeeds.ts
```

Alternatively, compile the project and run the generated JavaScript:

```bash
npm run build
node dist/reconstructSeeds.js
```

### Expected Output

A successful run should produce a table similar to the following. The `expected` column contains the reference seed, `value` contains the reconstructed seed, and `isAccurate` indicates whether they match.

```bash
┌─────────┬──────────────┬──────────┬──────────────────────────┬───────────────┬────────────────────────────────────────────┬────────────────────────────────────────────┬────────────┐
│ (index) │ name         │ kind     │ date                     │ unixTimestamp │ expected                                   │ value                                      │ isAccurate │
├─────────┼──────────────┼──────────┼──────────────────────────┼───────────────┼────────────────────────────────────────────┼────────────────────────────────────────────┼────────────┤
│ 0       │ 'prime239v1' │ 'PRIME'  │ 1997-05-15T15:49:03.000Z │ 863711343     │ 'E43BB460F0B80CC0C0B075798E948060F8321B7D' │ 'E43BB460F0B80CC0C0B075798E948060F8321B7D' │ true       │
│ 1       │ 'prime239v2' │ 'PRIME'  │ 1997-05-15T15:49:03.000Z │ 863711343     │ 'E8B4011604095303CA3B8099982BE09FCB9AE616' │ 'E8B4011604095303CA3B8099982BE09FCB9AE616' │ true       │
│ 2       │ 'prime239v3' │ 'PRIME'  │ 1997-05-15T15:49:03.000Z │ 863711343     │ '7D7374168FFE3471B60A857686A19475D3BFA2FF' │ '7D7374168FFE3471B60A857686A19475D3BFA2FF' │ true       │
│ 3       │ 'P-192'      │ 'PRIME'  │ 1997-05-18T14:45:34.000Z │ 863966734     │ '3045AE6FC8422F64ED579528D38120EAE12196D5' │ '3045AE6FC8422F64ED579528D38120EAE12196D5' │ true       │
│ 4       │ 'prime192v3' │ 'PRIME'  │ 1997-05-18T14:45:34.000Z │ 863966734     │ 'C469684435DEB378C4B65CA9591E2A5763059A2E' │ 'C469684435DEB378C4B65CA9591E2A5763059A2E' │ true       │
│ 5       │ 'prime192v2' │ 'PRIME'  │ 1997-05-18T14:45:34.000Z │ 863966734     │ '31A92EE2029FD10D901B113E990710F0D21AC6B6' │ '31A92EE2029FD10D901B113E990710F0D21AC6B6' │ true       │
│ 6       │ 'P-521'      │ 'PRIME'  │ 1997-08-08T01:12:04.000Z │ 871002724     │ 'D09E8800291CB85396CC6717393284AAA0DA64BA' │ 'D09E8800291CB85396CC6717393284AAA0DA64BA' │ true       │
│ 7       │ 'P-256'      │ 'PRIME'  │ 1997-08-16T01:52:34.000Z │ 871696354     │ 'C49D360886E704936A6678E1139D26B7819F7E90' │ 'C49D360886E704936A6678E1139D26B7819F7E90' │ true       │
│ 8       │ 'P-384'      │ 'PRIME'  │ 1997-08-30T14:50:08.000Z │ 872952608     │ 'A335926AA319A27A1D00896A6773A4827ACDAC73' │ 'A335926AA319A27A1D00896A6773A4827ACDAC73' │ true       │
│ 9       │ 'P-224'      │ 'PRIME'  │ 1998-04-03T12:52:07.000Z │ 891607927     │ 'BD71344799D5C7FCDC45B59FA3B9AB8F6A948BC5' │ 'BD71344799D5C7FCDC45B59FA3B9AB8F6A948BC5' │ true       │
│ 10      │ 'B-233'      │ 'BINARY' │ 1998-04-17T15:24:18.000Z │ 892826658     │ '74D59FF07F6B413D0EA14B344B20A2DB049B50C3' │ '74D59FF07F6B413D0EA14B344B20A2DB049B50C3' │ true       │
│ 11      │ 'B-283'      │ 'BINARY' │ 1998-04-17T15:27:44.000Z │ 892826864     │ '77E2B07370EB0F832A6DD5B62DFC88CD06BB84BE' │ '77E2B07370EB0F832A6DD5B62DFC88CD06BB84BE' │ true       │
│ 12      │ 'B-409'      │ 'BINARY' │ 1998-04-17T15:30:18.000Z │ 892827018     │ '4099B5A457F9D69F79213D094C4BCD4D4262210B' │ '4099B5A457F9D69F79213D094C4BCD4D4262210B' │ true       │
│ 13      │ 'B-571'      │ 'BINARY' │ 1998-04-17T15:32:08.000Z │ 892827128     │ '2AA058F73A0E33AB486B0F610410C53A7F132310' │ '2AA058F73A0E33AB486B0F610410C53A7F132310' │ true       │
└─────────┴──────────────┴──────────┴──────────────────────────┴───────────────┴────────────────────────────────────────────┴────────────────────────────────────────────┴────────────┘
```
