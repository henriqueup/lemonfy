import { createGainNode } from "../functions";
import { createNote, Note } from "./note";
import { createPitch, PitchDictionary } from "./pitch";

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
      if (!note.pitch.key) continue;

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
      oscillator.frequency.value = PitchDictionary[note.pitch.key];
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
      createNote(4, 0, createPitch("C#", 1)),
      createNote(4, 0, createPitch("C#", 2)),
      createNote(1 / 3, 0, createPitch("G#", 2)),
      createNote(1 / 3, 1 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 2 / 3, createPitch("E", 3)),
      createNote(1 / 3, 1, createPitch("G#", 2)),
      createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 5 / 3, createPitch("E", 3)),
      createNote(1 / 3, 2, createPitch("G#", 2)),
      createNote(1 / 3, 7 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 8 / 3, createPitch("E", 3)),
      createNote(1 / 3, 3, createPitch("G#", 2)),
      createNote(1 / 3, 10 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 11 / 3, createPitch("E", 3)),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: 60,
    notes: [
      createNote(4, 0, createPitch("B", 0)),
      createNote(4, 0, createPitch("B", 1)),
      createNote(1 / 3, 0, createPitch("G#", 2)),
      createNote(1 / 3, 1 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 2 / 3, createPitch("E", 3)),
      createNote(1 / 3, 1, createPitch("G#", 2)),
      createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 5 / 3, createPitch("E", 3)),
      createNote(1 / 3, 2, createPitch("G#", 2)),
      createNote(1 / 3, 7 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 8 / 3, createPitch("E", 3)),
      createNote(1 / 3, 3, createPitch("G#", 2)),
      createNote(1 / 3, 10 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 11 / 3, createPitch("E", 3)),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: 60,
    notes: [
      createNote(4, 0, createPitch("A", 0)),
      createNote(4, 0, createPitch("A", 1)),
      createNote(1 / 3, 0, createPitch("A", 2)),
      createNote(1 / 3, 1 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 2 / 3, createPitch("E", 3)),
      createNote(1 / 3, 1, createPitch("A", 2)),
      createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 5 / 3, createPitch("E", 3)),
      createNote(2, 2, createPitch("F#", 0)),
      createNote(2, 2, createPitch("F#", 1)),
      createNote(1 / 3, 2, createPitch("A", 2)),
      createNote(1 / 3, 7 / 3, createPitch("D", 3)),
      createNote(1 / 3, 8 / 3, createPitch("F#", 3)),
      createNote(1 / 3, 3, createPitch("A", 2)),
      createNote(1 / 3, 10 / 3, createPitch("D", 3)),
      createNote(1 / 3, 11 / 3, createPitch("F#", 3)),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: 60,
    notes: [
      createNote(2, 0, createPitch("G#", 0)),
      createNote(2, 0, createPitch("G#", 1)),
      createNote(1 / 3, 0, createPitch("G#", 2)),
      createNote(1 / 3, 1 / 3, createPitch("C", 3)),
      createNote(1 / 3, 2 / 3, createPitch("F#", 3)),
      createNote(1 / 3, 1, createPitch("G#", 2)),
      createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 5 / 3, createPitch("E", 3)),
      createNote(2, 2, createPitch("G#", 0)),
      createNote(2, 2, createPitch("G#", 1)),
      createNote(1 / 3, 2, createPitch("G#", 2)),
      createNote(1 / 3, 7 / 3, createPitch("C#", 3)),
      createNote(1 / 3, 8 / 3, createPitch("D#", 3)),
      createNote(1 / 3, 3, createPitch("F#", 2)),
      createNote(1 / 3, 10 / 3, createPitch("C", 3)),
      createNote(1 / 3, 11 / 3, createPitch("D#", 3)),
    ],
  },
];
