import { createGainNode } from "../functions";
import { createNote, Note } from "./note";

export type Bar = {
  beats: number;
  dibobinador: number;
  notes: Note[];
  tempo: number;
};

export const generateOscillators = (bars: Bar[], audioContext: AudioContext | null): void => {
  if (!audioContext) return;

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    const baseStart = (bar.tempo / 60) * bar.beats * i;

    for (let j = 0; j < bar.notes.length; j++) {
      const note = bar.notes[j];
      const oscillator = audioContext.createOscillator();
      const gainNode = createGainNode(audioContext);
      if (!gainNode) return;

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime + baseStart + note.start);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + baseStart + note.start + note.duration);
      oscillator.connect(gainNode);

      //no clue wtf is going on here... gotta learn about sound wave synthesis, I guess
      const sineTerms = new Float32Array([1, 1, 1, 0, 1, 1, 0, 0, 1]);
      const cosineTerms = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1]);
      const customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

      oscillator.setPeriodicWave(customWaveform);
      oscillator.frequency.value = note.pitch.frequency;
      oscillator.start();
    }
  }
};

/*
sources
https://www.youtube.com/watch?v=skFugVOqBM4
https://pages.mtu.edu/~suits/notefreqs.html
https://musescore.com/classicman/scores/55352
*/
export const getMoonlightSonataBars = (): Bar[] => [
  {
    beats: 4,
    dibobinador: 4,
    tempo: 60,
    notes: [
      createNote(4, 0, { name: "C#", octave: 1, frequency: 34.65 }),
      createNote(4, 0, { name: "C#", octave: 2, frequency: 69.3 }),
      createNote(1 / 3, 0, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 1 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 2 / 3, { name: "E", octave: 3, frequency: 164.81 }),
      createNote(1 / 3, 1, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 4 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 5 / 3, { name: "E", octave: 3, frequency: 164.81 }),
      createNote(1 / 3, 2, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 7 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 8 / 3, { name: "E", octave: 3, frequency: 164.81 }),
      createNote(1 / 3, 3, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 10 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 11 / 3, { name: "E", octave: 3, frequency: 164.81 }),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: 60,
    notes: [
      createNote(4, 0, { name: "B", octave: 0, frequency: 30.87 }),
      createNote(4, 0, { name: "B", octave: 1, frequency: 61.74 }),
      createNote(1 / 3, 0, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 1 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 2 / 3, { name: "E", octave: 3, frequency: 164.81 }),
      createNote(1 / 3, 1, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 4 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 5 / 3, { name: "E", octave: 3, frequency: 164.81 }),
      createNote(1 / 3, 2, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 7 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 8 / 3, { name: "E", octave: 3, frequency: 164.81 }),
      createNote(1 / 3, 3, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 10 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 11 / 3, { name: "E", octave: 3, frequency: 164.81 }),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: 60,
    notes: [
      createNote(4, 0, { name: "A", octave: 0, frequency: 27.5 }),
      createNote(4, 0, { name: "A", octave: 1, frequency: 55.0 }),
      createNote(1 / 3, 0, { name: "A", octave: 2, frequency: 110.0 }),
      createNote(1 / 3, 1 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 2 / 3, { name: "E", octave: 3, frequency: 164.81 }),
      createNote(1 / 3, 1, { name: "A", octave: 2, frequency: 110.0 }),
      createNote(1 / 3, 4 / 3, { name: "C#", octave: 3, frequency: 138.59 }),
      createNote(1 / 3, 5 / 3, { name: "E", octave: 3, frequency: 164.81 }),
      createNote(2, 2, { name: "F#", octave: 0, frequency: 23.12 }),
      createNote(2, 2, { name: "F#", octave: 1, frequency: 46.25 }),
      createNote(1 / 3, 2, { name: "A", octave: 2, frequency: 110.0 }),
      createNote(1 / 3, 7 / 3, { name: "D", octave: 3, frequency: 146.83 }),
      createNote(1 / 3, 8 / 3, { name: "F#", octave: 3, frequency: 185.0 }),
      createNote(1 / 3, 3, { name: "A", octave: 2, frequency: 110.0 }),
      createNote(1 / 3, 10 / 3, { name: "D", octave: 3, frequency: 146.83 }),
      createNote(1 / 3, 11 / 3, { name: "F#", octave: 3, frequency: 185.0 }),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: 60,
    notes: [
      createNote(2, 0, { name: "G#", octave: 0, frequency: 25.96 }),
      createNote(2, 0, { name: "G#", octave: 1, frequency: 51.91 }),
      createNote(1 / 3, 0, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 1 / 3, { name: "C", octave: 3, frequency: 130.81 }),
      createNote(1 / 3, 2 / 3, { name: "F#", octave: 3, frequency: 185.0 }),
      createNote(1 / 3, 1, { name: "G#", octave: 2, frequency: 103.83 }),
      createNote(1 / 3, 4 / 3, { name: "C", octave: 3, frequency: 130.81 }),
      createNote(1 / 3, 5 / 3, { name: "F#", octave: 3, frequency: 185.0 }),
    ],
  },
];
