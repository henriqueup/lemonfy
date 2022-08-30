import { Pitch } from "./pitch";

export type Note = {
  duration: number;
  pitch: Pitch;
  start: number;
};

export const createNote = (duration: number, start: number, pitch: Pitch): Note => ({
  duration,
  pitch,
  start,
});
