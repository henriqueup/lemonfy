export const toPrecision = (value: number, digitCount = 9): number =>
  Number(value.toFixed(digitCount));
