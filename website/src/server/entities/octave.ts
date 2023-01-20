const OCTAVES = [0, 1, 2, 3, 4, 5] as const;
export type Octave = (typeof OCTAVES)[number];
export const NUMBER_OF_OCTAVES = OCTAVES.length;

export const isOctave = (value: number): value is Octave => value in OCTAVES;

const getNextOctave = (currentOctave: Octave, isRaise: boolean) => {
  const nextOctave = isRaise ? currentOctave + 1 : currentOctave - 1;
  if (isOctave(nextOctave)) return nextOctave;

  return currentOctave;
};

export const getHigherOctave = (currentOctave: Octave) => getNextOctave(currentOctave, true);
export const getLowerOctave = (currentOctave: Octave) => getNextOctave(currentOctave, false);
