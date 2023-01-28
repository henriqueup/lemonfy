const TOLERANCE = 1e-8;

export const IsEqualTo = (a: number, b: number) => {
  return Math.abs(a - b) < TOLERANCE;
};

export const IsGreaterThan = (a: number, b: number) => {
  return a - b > TOLERANCE;
};

export const IsSmallerThan = (a: number, b: number) => {
  return IsGreaterThan(b, a);
};

export const IsGreaterOrEqualTo = (a: number, b: number) => {
  return IsEqualTo(a, b) || IsGreaterThan(a, b);
};

export const IsSmallerOrEqualTo = (a: number, b: number) => {
  return IsEqualTo(a, b) || IsSmallerThan(a, b);
};
