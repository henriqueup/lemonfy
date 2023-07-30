export const toPrecision = (value: number, digitCount = 9): number =>
  Number(value.toFixed(digitCount));

export const parseNumber = (value: string, fallback = 0) => {
  const number = Number(value);

  return Number.isNaN(number) ? fallback : number;
};
