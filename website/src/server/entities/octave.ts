import { z } from "zod";

const OCTAVES = [z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)] as const;
export const NUMBER_OF_OCTAVES = OCTAVES.length;

export const OctaveSchema = z.union(OCTAVES);
export type Octave = z.infer<typeof OctaveSchema>;

const getNextOctave = (currentOctave: Octave, isRaise: boolean) => {
  const nextOctave = isRaise ? currentOctave + 1 : currentOctave - 1;
  if (OctaveSchema.safeParse(nextOctave).success) return nextOctave;

  return currentOctave;
};

export const getHigherOctave = (currentOctave: Octave) => getNextOctave(currentOctave, true);
export const getLowerOctave = (currentOctave: Octave) => getNextOctave(currentOctave, false);
