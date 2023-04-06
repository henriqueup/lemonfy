import { z } from "zod";

// const OCTAVES = [0, 1, 2, 3, 4, 5] as const;
// export type Octave = (typeof OCTAVES)[number];
// export const NUMBER_OF_OCTAVES = OCTAVES.length;

// const isOctave = (value: number): value is Octave => value in OCTAVES;

// const getNextOctave = (currentOctave: Octave, isRaise: boolean) => {
//   const nextOctave = isRaise ? currentOctave + 1 : currentOctave - 1;
//   if (isOctave(nextOctave)) return nextOctave;

//   return currentOctave;
// };

// export const getHigherOctave = (currentOctave: Octave) => getNextOctave(currentOctave, true);
// export const getLowerOctave = (currentOctave: Octave) => getNextOctave(currentOctave, false);

const OCTAVES = [z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)] as const;
export const OctaveSchema = z.union(OCTAVES);
export type Octave = z.infer<typeof OctaveSchema>; // TODO: rename to RawOctave
export const NUMBER_OF_OCTAVES = OCTAVES.length;

const isOctave = (value: number): value is Octave => value in OCTAVES; //.map(literal => literal.value);

const getNextOctave = (currentOctave: Octave, isRaise: boolean) => {
  const nextOctave = isRaise ? currentOctave + 1 : currentOctave - 1;
  if (isOctave(nextOctave)) return nextOctave;

  return currentOctave;
};

export const getHigherOctave = (currentOctave: Octave) => getNextOctave(currentOctave, true);
export const getLowerOctave = (currentOctave: Octave) => getNextOctave(currentOctave, false);
