import { getHigherOctave, getLowerOctave, type Octave } from "@entities/octave";

describe("Get higher octave", () => {
  it("Gets same Octave from highest Octave", () => {
    const higherOctave = getHigherOctave(5);

    expect(higherOctave).toBe<Octave>(5);
  });

  it("Gets higher Octave", () => {
    const higherOctave = getHigherOctave(2);

    expect(higherOctave).toBe<Octave>(3);
  });
});

describe("Get lower octave", () => {
  it("Gets same Octave from lowest Octave", () => {
    const lowerOctave = getLowerOctave(0);

    expect(lowerOctave).toBe<Octave>(0);
  });

  it("Gets lower Octave", () => {
    const lowerOctave = getLowerOctave(2);

    expect(lowerOctave).toBe<Octave>(1);
  });
});
