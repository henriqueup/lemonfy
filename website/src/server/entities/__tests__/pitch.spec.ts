import { type Octave } from "@entities/octave";
import {
  createPitch,
  type PitchName,
  type PitchKey,
  FrequencyDictionary,
} from "@entities/pitch";

describe("Create Pitch", () => {
  it("Creates Pitch with initial values", () => {
    const newPitch = createPitch("E", 3);

    expect(newPitch.key).toBe<PitchKey>("E3");
    expect(newPitch.name).toBe<PitchName>("E");
    expect(newPitch.octave).toBe<Octave>(3);
    expect(newPitch.frequency).toBe(FrequencyDictionary["E3"]);
  });

  it("Fails with invalid Octave", () => {
    expect(() => createPitch("E", 9)).toThrow(/invalid_union/);
  });
});
