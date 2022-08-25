enum PitchNames {
  C = "C",
  C_SHARP = "C#",
}

type Octaves = 1 | 2 | 3 | 4 | 5 | 6;

export type Pitch = {
  name: PitchNames;
  octave: Octaves;
  frequency: number;
};
