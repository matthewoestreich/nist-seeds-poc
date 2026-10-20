import { Stream2 } from "./types.ts";

const streams: Stream2[] = [
  {
    date: new Date("1997-05-15T15:49:03.000Z"),
    timestamp: 863711343,
    lrand48Iterations: 20,
    candidateNumber: 3048,
    primeField:
      883423532389192164791648750360308885314476597252960362792450860609699839n,
    published: [
      {
        name: "prime239v1",
        seed: "E43BB460F0B80CC0C0B075798E948060F8321B7D",
      },
      {
        name: "prime239v2",
        seed: "E8B4011604095303CA3B8099982BE09FCB9AE616",
      },
      {
        name: "prime239v3",
        seed: "7D7374168FFE3471B60A857686A19475D3BFA2FF",
      },
    ],
  },
  {
    date: new Date("1997-05-18T14:45:34.000Z"),
    timestamp: 863966734,
    lrand48Iterations: 20,
    candidateNumber: 6013,
    primeField: 6277101735386680763835789423207666416083908700390324961279n,
    published: [
      { name: "P-192", seed: "3045AE6FC8422F64ED579528D38120EAE12196D5" },
      {
        name: "prime192v3",
        seed: "C469684435DEB378C4B65CA9591E2A5763059A2E",
      },
      {
        name: "prime192v2",
        seed: "31A92EE2029FD10D901B113E990710F0D21AC6B6",
      },
    ],
  },
  {
    date: new Date("1997-08-08T01:12:04.000Z"),
    timestamp: 871002724,
    lrand48Iterations: 20,
    candidateNumber: 1136,
    primeField:
      6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057151n,
    published: [
      { name: "P-521", seed: "D09E8800291CB85396CC6717393284AAA0DA64BA" },
    ],
  },
  {
    date: new Date("1997-08-16T01:52:34.000Z"),
    timestamp: 871696354,
    lrand48Iterations: 20,
    candidateNumber: 1842,
    primeField:
      115792089210356248762697446949407573530086143415290314195533631308867097853951n,
    published: [
      { name: "P-256", seed: "C49D360886E704936A6678E1139D26B7819F7E90" },
    ],
  },
  {
    date: new Date("1997-08-30T14:50:08.000Z"),
    timestamp: 872952608,
    lrand48Iterations: 20,
    candidateNumber: 2688,
    primeField:
      39402006196394479212279040100143613805079739270465446667948293404245721771496870329047266088258938001861606973112319n,
    published: [
      { name: "P-384", seed: "A335926AA319A27A1D00896A6773A4827ACDAC73" },
    ],
  },
  {
    date: new Date("1998-04-03T12:52:07.000Z"),
    timestamp: 891607927,
    lrand48Iterations: 20,
    candidateNumber: 7026,
    primeField:
      26959946667150639794667015087019630673557916260026308143510066298881n,
    published: [
      { name: "P-224", seed: "BD71344799D5C7FCDC45B59FA3B9AB8F6A948BC5" },
    ],
  },
  {
    date: new Date("1998-04-17T15:24:18.000Z"),
    timestamp: 892826658,
    lrand48Iterations: 5,
    candidateNumber: 155,
    published: [
      { name: "B-233", seed: "74D59FF07F6B413D0EA14B344B20A2DB049B50C3" },
    ],
  },
  {
    date: new Date("1998-04-17T15:27:44.000Z"),
    timestamp: 892826864,
    lrand48Iterations: 5,
    candidateNumber: 32,
    published: [
      { name: "B-283", seed: "77E2B07370EB0F832A6DD5B62DFC88CD06BB84BE" },
    ],
  },
  {
    date: new Date("1998-04-17T15:30:18.000Z"),
    timestamp: 892827018,
    lrand48Iterations: 5,
    candidateNumber: 60,
    published: [
      { name: "B-409", seed: "4099B5A457F9D69F79213D094C4BCD4D4262210B" },
    ],
  },
  {
    date: new Date("1998-04-17T15:32:08.000Z"),
    timestamp: 892827128,
    lrand48Iterations: 5,
    candidateNumber: 73,
    published: [
      { name: "B-571", seed: "2AA058F73A0E33AB486B0F610410C53A7F132310" },
    ],
  },
];

export default streams;
