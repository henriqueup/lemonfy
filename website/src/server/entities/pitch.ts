import { type Octave } from "./octave";

export const PITCH_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "X"] as const;

export type PitchName = (typeof PITCH_NAMES)[number];
export const NUMBER_OF_PICHES_IN_OCTAVE = 12;

export type PitchKey = `${PitchName}${Octave}`;

export type Pitch = {
  name: PitchName;
  octave: Octave;
  key: PitchKey;
  frequency?: number;
};

export const createPitch = (name: PitchName, octave: Octave) => ({
  name,
  octave,
  key: getPitchKey(name, octave),
});

export const getPitchKey = (name: PitchName, octave: Octave): PitchKey => `${name}${octave}`;

// prettier-ignore
export const FrequencyDictionary: Record<PitchKey, number> = {
  "X0": 0,
  "C0": 16.35,
  "C#0": 17.32,
  "D0": 18.35,
  "D#0": 19.45,
  "E0": 20.6,
  "F0": 21.83,
  "F#0": 23.12,
  "G0": 24.5,
  "G#0": 25.96,
  "A0": 27.5,
  "A#0": 29.14,
  "B0": 30.87,
  "X1": 0,
  "C1": 32.7,
  "C#1": 34.65,
  "D1": 36.71,
  "D#1": 38.89,
  "E1": 41.2,
  "F1": 43.65,
  "F#1": 46.25,
  "G1": 49.0,
  "G#1": 51.91,
  "A1": 55.0,
  "A#1": 58.27,
  "B1": 61.74,
  "X2": 0,
  "C2": 65.41,
  "C#2": 69.3,
  "D2": 73.42,
  "D#2": 77.78,
  "E2": 82.41,
  "F2": 87.31,
  "F#2": 92.5,
  "G2": 98.0,
  "G#2": 103.83,
  "A2": 110.0,
  "A#2": 116.54,
  "B2": 123.47,
  "X3": 0,
  "C3": 130.81,
  "C#3": 138.59,
  "D3": 146.83,
  "D#3": 155.56,
  "E3": 164.81,
  "F3": 174.61,
  "F#3": 185.0,
  "G3": 196.0,
  "G#3": 207.65,
  "A3": 220.0,
  "A#3": 233.08,
  "B3": 246.94,
  "X4": 0,
  "C4": 261.63,
  "C#4": 277.18,
  "D4": 293.66,
  "D#4": 311.13,
  "E4": 329.63,
  "F4": 349.23,
  "F#4": 369.99,
  "G4": 392.0,
  "G#4": 415.3,
  "A4": 440.0,
  "A#4": 466.16,
  "B4": 493.88,
  "X5": 0,
  "C5": 523.25,
  "C#5": 554.37,
  "D5": 587.33,
  "D#5": 622.25,
  "E5": 659.25,
  "F5": 698.46,
  "F#5": 739.99,
  "G5": 783.99,
  "G#5": 830.61,
  "A5": 880.0,
  "A#5": 932.33,
  "B5": 987.77,
} as const;
