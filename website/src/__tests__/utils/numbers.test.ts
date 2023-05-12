import { toPrecision } from "src/utils/numbers";

describe("toPrecision", () => {
  it("Rounds value with more digits correctly with default precision", () => {
    const value = 1 / 3;

    const result = toPrecision(value);

    expect(result).toEqual(0.333333333);
  });

  it("Rounds value with fewer digits correctly with default precision", () => {
    const value = -0.5;

    const result = toPrecision(value);

    expect(result).toEqual(-0.5);
  });

  it("Rounds value with more digits correctly with custom precision", () => {
    const value = -1 / 3;

    const result = toPrecision(value, 3);

    expect(result).toEqual(-0.333);
  });

  it("Rounds value with fewer digits correctly with custom precision", () => {
    const value = 0.5;

    const result = toPrecision(value, 3);

    expect(result).toEqual(0.5);
  });
});
