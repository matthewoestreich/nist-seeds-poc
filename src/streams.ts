import type { Stream } from "./types.ts";

const streams: Stream[] = [
  {
    date: new Date("1997-05-15T15:49:03.000Z"),
    timestamp: 863711343,
    primeField:
      883423532389192164791648750360308885314476597252960362792450860609699839n,
    published: [
      {
        name: "prime239v1",
        candidateNumber: 2185,
        seed: 0xe43bb460f0b80cc0c0b075798e948060f8321b7dn,
      },
      {
        name: "prime239v2",
        candidateNumber: 2320,
        seed: 0xe8b4011604095303ca3b8099982be09fcb9ae616n,
      },
      {
        name: "prime239v3",
        candidateNumber: 3048,
        seed: 0x7d7374168ffe3471b60a857686a19475d3bfa2ffn,
      },
    ],
  },
  {
    date: new Date("1997-05-18T14:45:34.000Z"),
    timestamp: 863966734,
    primeField: 6277101735386680763835789423207666416083908700390324961279n,
    published: [
      {
        name: "P-192",
        candidateNumber: 139,
        seed: 0x3045ae6fc8422f64ed579528d38120eae12196d5n,
      },
      {
        name: "prime192v3",
        candidateNumber: 5228,
        seed: 0xc469684435deb378c4b65ca9591e2a5763059a2en,
      },
      {
        name: "prime192v2",
        candidateNumber: 6013,
        seed: 0x31a92ee2029fd10d901b113e990710f0d21ac6b6n,
      },
    ],
  },
  {
    date: new Date("1997-08-08T01:12:04.000Z"),
    timestamp: 871002724,
    primeField:
      6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057151n,
    published: [
      {
        name: "P-521",
        candidateNumber: 1136,
        seed: 0xd09e8800291cb85396cc6717393284aaa0da64ban,
      },
    ],
  },
  {
    date: new Date("1997-08-16T01:52:34.000Z"),
    timestamp: 871696354,
    primeField:
      115792089210356248762697446949407573530086143415290314195533631308867097853951n,
    published: [
      {
        name: "P-256",
        candidateNumber: 1842,
        seed: 0xc49d360886e704936a6678e1139d26b7819f7e90n,
      },
    ],
  },
  {
    date: new Date("1997-08-30T14:50:08.000Z"),
    timestamp: 872952608,
    primeField:
      39402006196394479212279040100143613805079739270465446667948293404245721771496870329047266088258938001861606973112319n,
    published: [
      {
        name: "P-384",
        candidateNumber: 2688,
        seed: 0xa335926aa319a27a1d00896a6773a4827acdac73n,
      },
    ],
  },
  {
    date: new Date("1998-04-03T12:52:07.000Z"),
    timestamp: 891607927,
    primeField:
      26959946667150639794667015087019630673557916260026308143510066298881n,
    published: [
      {
        name: "P-224",
        candidateNumber: 7026,
        seed: 0xbd71344799d5c7fcdc45b59fa3b9ab8f6a948bc5n,
      },
    ],
  },
  {
    date: new Date("1998-04-17T15:24:18.000Z"),
    timestamp: 892826658,
    published: [
      {
        name: "B-233",
        candidateNumber: 155,
        seed: 0x74d59ff07f6b413d0ea14b344b20a2db049b50c3n,
      },
    ],
  },
  {
    date: new Date("1998-04-17T15:27:44.000Z"),
    timestamp: 892826864,
    published: [
      {
        name: "B-283",
        candidateNumber: 32,
        seed: 0x77e2b07370eb0f832a6dd5b62dfc88cd06bb84ben,
      },
    ],
  },
  {
    date: new Date("1998-04-17T15:30:18.000Z"),
    timestamp: 892827018,
    published: [
      {
        name: "B-409",
        candidateNumber: 60,
        seed: 0x4099b5a457f9d69f79213d094c4bcd4d4262210bn,
      },
    ],
  },
  {
    date: new Date("1998-04-17T15:32:08.000Z"),
    timestamp: 892827128,
    published: [
      {
        name: "B-571",
        candidateNumber: 73,
        seed: 0x2aa058f73a0e33ab486b0f610410c53a7f132310n,
      },
    ],
  },
];

export default streams;
