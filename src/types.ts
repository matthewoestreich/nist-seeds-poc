export const CurveKind = {
  Prime: "PRIME",
  Binary: "BINARY",
} as const;

export type CurveKind = (typeof CurveKind)[keyof typeof CurveKind];

export type CurveResult = {
  name: string;
  kind: CurveKind;
  date: Date;
  unixTimestamp: number;
  expected: string;
  value: string;
  isAccurate: boolean;
};

export type Curve = {
  name: string;
  kind: CurveKind;
  date: Date;
  unixTimestamp?: number;
  prngIterations: number;
  overallIterations: number;
  shiftOutputBy: number;
  width: number;
  expected: string;
};
