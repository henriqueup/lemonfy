import { TimeEvaluation } from "src/utils/timeEvaluation";

describe("Time Evaluation", () => {
  const valueAboveTolerance = 1e-7;
  const valueBelowTolerance = 1e-8;

  it("Detectcs difference with value above tolerance", () => {
    const valueA = 1;
    const valueB = 1 + valueAboveTolerance;

    expect(TimeEvaluation.IsEqualTo(valueA, valueB)).toBe(false);
    expect(TimeEvaluation.IsGreaterThan(valueA, valueB)).toBe(false);
    expect(TimeEvaluation.IsSmallerThan(valueA, valueB)).toBe(true);
    expect(TimeEvaluation.IsGreaterOrEqualTo(valueA, valueB)).toBe(false);
    expect(TimeEvaluation.IsSmallerOrEqualTo(valueA, valueB)).toBe(true);
  });

  it("Doesn't detect difference with value below tolerance", () => {
    const valueA = 1;
    const valueB = 1 + valueBelowTolerance;

    expect(TimeEvaluation.IsEqualTo(valueA, valueB)).toBe(true);
    expect(TimeEvaluation.IsGreaterThan(valueA, valueB)).toBe(false);
    expect(TimeEvaluation.IsSmallerThan(valueA, valueB)).toBe(false);
    expect(TimeEvaluation.IsGreaterOrEqualTo(valueA, valueB)).toBe(true);
    expect(TimeEvaluation.IsSmallerOrEqualTo(valueA, valueB)).toBe(true);
  });
});
