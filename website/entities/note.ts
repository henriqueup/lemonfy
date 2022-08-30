import { Pitch } from "./pitch";

export type Note = {
  name: string;
  duration: number;
  pitch: Pitch;
  start: number;
};

export const createNote = (duration: number, start: number, pitch: Pitch): Note => ({
  name: `${pitch.name}${pitch.octave}`,
  duration,
  pitch,
  start,
});
