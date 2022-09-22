import { createGainNode } from "../functions";
import { createNote, Note, NoteDuration } from "./note";
import { createPitch, PitchDictionary } from "./pitch";
const TEMPO_VALUE_IN_SECONDS = 60;

export type Bar = {
  beats: NoteDuration;
  dibobinador: number;
  notes: Note[];
  tempo: number;
};

export const fillBeat = (dibobinador: number, beat: number, notes: Note[]) => {
  const notesDurationSum = notes.reduce((currentDuration, currentNote) => currentDuration + currentNote.duration, 0);

  if (notesDurationSum != 1 / dibobinador)
    throw new Error(`Invalid beat notes, expected total duration: '${1 / dibobinador}', actual: '${notesDurationSum}'`);

  let currentStart = beat * (1 / dibobinador);
  for (const note of notes) {
    note.start = currentStart;
    currentStart += note.duration;
  }

  return notes;
};

export const getTimeRatio = (tempo: number) => tempo / TEMPO_VALUE_IN_SECONDS;

export const convertToSeconds = (value: NoteDuration, dibobinador: number) => value * dibobinador;

export const setNotesTimesInSeconds = (bar: Bar) => {
  for (let i = 0; i < bar.notes.length; i++) {
    const note = bar.notes[i];
    if (note.start == undefined) throw new Error(`Invalid note at ${i}, undefined start.`);

    const timeRatio = getTimeRatio(bar.tempo);
    note.durationInSeconds = convertToSeconds(note.duration, bar.dibobinador) / timeRatio;
    note.startInSeconds = convertToSeconds(note.start, bar.dibobinador) / timeRatio;
  }
};

export const playSong = (bars: Bar[], audioContext: AudioContext | null): void => {
  if (!audioContext) return;

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    const timeRatio = getTimeRatio(bar.tempo);
    const baseStart = (bar.beats * i) / timeRatio;

    for (let j = 0; j < bar.notes.length; j++) {
      const note = bar.notes[j];
      if (note.startInSeconds == undefined)
        throw new Error(`Invalid note: '${j}' at bar '${i}', undefined startInSeconds.'`);
      if (note.durationInSeconds == undefined)
        throw new Error(`Invalid note: '${j}' at bar '${i}', undefined durationInSeconds.'`);

      const oscillator = audioContext.createOscillator();
      const gainNode = createGainNode(audioContext);

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime + baseStart + note.startInSeconds);
      gainNode.gain.setValueAtTime(
        0,
        audioContext.currentTime + baseStart + note.startInSeconds + note.durationInSeconds,
      );
      oscillator.connect(gainNode);

      //no clue wtf is going on here... gotta learn about sound wave synthesis, I guess
      const sineTerms = new Float32Array([1, 1, 1, 0, 1, 1, 0, 0, 1]);
      const cosineTerms = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1]);
      const customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

      oscillator.setPeriodicWave(customWaveform);
      oscillator.frequency.value = note.pitch?.key ? PitchDictionary[note.pitch.key] : 0;
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
const moonlightSonataTempo = 54;
export const getMoonlightSonataBars = (): Bar[] => [
  {
    beats: 4,
    dibobinador: 4,
    tempo: moonlightSonataTempo,
    notes: [
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("C#", 1))]),
      ...fillBeat(4, 1, [createNote(NoteDuration.QUARTER, createPitch("C#", 1))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("C#", 1))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("C#", 1))]),
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("C#", 2))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("C#", 2))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("C#", 2))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("C#", 2))]),
      ...fillBeat(4, 0, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      ...fillBeat(4, 1, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      ...fillBeat(4, 2, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      ...fillBeat(4, 3, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      // createNote(4, 0, createPitch("C#", 1)),
      // createNote(4, 0, createPitch("C#", 2)),
      // createNote(1 / 3, 0, createPitch("G#", 2)),
      // createNote(1 / 3, 1 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 2 / 3, createPitch("E", 3)),
      // createNote(1 / 3, 1, createPitch("G#", 2)),
      // createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 5 / 3, createPitch("E", 3)),
      // createNote(1 / 3, 2, createPitch("G#", 2)),
      // createNote(1 / 3, 7 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 8 / 3, createPitch("E", 3)),
      // createNote(1 / 3, 3, createPitch("G#", 2)),
      // createNote(1 / 3, 10 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 11 / 3, createPitch("E", 3)),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: moonlightSonataTempo,
    notes: [
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("B", 0))]),
      ...fillBeat(4, 1, [createNote(NoteDuration.QUARTER, createPitch("B", 0))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("B", 0))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("B", 0))]),
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("B", 1))]),
      ...fillBeat(4, 1, [createNote(NoteDuration.QUARTER, createPitch("B", 1))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("B", 1))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("B", 1))]),
      ...fillBeat(4, 0, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      ...fillBeat(4, 1, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      ...fillBeat(4, 2, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      ...fillBeat(4, 3, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      // createNote(4, 0, createPitch("B", 1)),
      // createNote(4, 0, createPitch("B", 2)),
      // createNote(1 / 3, 0, createPitch("G#", 2)),
      // createNote(1 / 3, 1 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 2 / 3, createPitch("E", 3)),
      // createNote(1 / 3, 1, createPitch("G#", 2)),
      // createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 5 / 3, createPitch("E", 3)),
      // createNote(1 / 3, 2, createPitch("G#", 2)),
      // createNote(1 / 3, 7 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 8 / 3, createPitch("E", 3)),
      // createNote(1 / 3, 3, createPitch("G#", 2)),
      // createNote(1 / 3, 10 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 11 / 3, createPitch("E", 3)),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: moonlightSonataTempo,
    notes: [
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("A", 0))]),
      ...fillBeat(4, 1, [createNote(NoteDuration.QUARTER, createPitch("A", 0))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("F#", 0))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("F#", 0))]),
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("A", 1))]),
      ...fillBeat(4, 1, [createNote(NoteDuration.QUARTER, createPitch("A", 1))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("F#", 1))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("F#", 1))]),
      ...fillBeat(4, 0, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("A", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      ...fillBeat(4, 1, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("A", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      ...fillBeat(4, 2, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("A", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("D", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("F#", 3)),
      ]),
      ...fillBeat(4, 3, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("A", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("D", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("F#", 3)),
      ]),
      // createNote(4, 0, createPitch("A", 0)),
      // createNote(4, 0, createPitch("A", 1)),
      // createNote(1 / 3, 0, createPitch("A", 2)),
      // createNote(1 / 3, 1 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 2 / 3, createPitch("E", 3)),
      // createNote(1 / 3, 1, createPitch("A", 2)),
      // createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 5 / 3, createPitch("E", 3)),
      // createNote(2, 2, createPitch("F#", 0)),
      // createNote(2, 2, createPitch("F#", 1)),
      // createNote(1 / 3, 2, createPitch("A", 2)),
      // createNote(1 / 3, 7 / 3, createPitch("D", 3)),
      // createNote(1 / 3, 8 / 3, createPitch("F#", 3)),
      // createNote(1 / 3, 3, createPitch("A", 2)),
      // createNote(1 / 3, 10 / 3, createPitch("D", 3)),
      // createNote(1 / 3, 11 / 3, createPitch("F#", 3)),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: moonlightSonataTempo,
    notes: [
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("G#", 0))]),
      ...fillBeat(4, 1, [createNote(NoteDuration.QUARTER, createPitch("G#", 0))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("G#", 0))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("G#", 0))]),
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("G#", 1))]),
      ...fillBeat(4, 1, [createNote(NoteDuration.QUARTER, createPitch("G#", 1))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("G#", 1))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("G#", 1))]),
      ...fillBeat(4, 0, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("F#", 3)),
      ]),
      ...fillBeat(4, 1, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
      ]),
      ...fillBeat(4, 2, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("D#", 3)),
      ]),
      ...fillBeat(4, 3, [
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("F#", 2)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C", 3)),
        createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("D#", 3)),
      ]),
      // createNote(2, 0, createPitch("G#", 0)),
      // createNote(2, 0, createPitch("G#", 1)),
      // createNote(1 / 3, 0, createPitch("G#", 2)),
      // createNote(1 / 3, 1 / 3, createPitch("C", 3)),
      // createNote(1 / 3, 2 / 3, createPitch("F#", 3)),
      // createNote(1 / 3, 1, createPitch("G#", 2)),
      // createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 5 / 3, createPitch("E", 3)),
      // createNote(2, 2, createPitch("G#", 0)),
      // createNote(2, 2, createPitch("G#", 1)),
      // createNote(1 / 3, 2, createPitch("G#", 2)),
      // createNote(1 / 3, 7 / 3, createPitch("C#", 3)),
      // createNote(1 / 3, 8 / 3, createPitch("D#", 3)),
      // createNote(1 / 3, 3, createPitch("F#", 2)),
      // createNote(1 / 3, 10 / 3, createPitch("C", 3)),
      // createNote(1 / 3, 11 / 3, createPitch("D#", 3)),
    ],
  },
];

const masterOfPuppetsTempo = 212;
export const getMasterOfPuppetsBars = (): Bar[] => [
  {
    beats: 4,
    dibobinador: 4,
    tempo: masterOfPuppetsTempo,
    notes: [
      ...fillBeat(4, 0, [createNote(NoteDuration.EIGHTH, createPitch("E", 2)), createNote(NoteDuration.EIGHTH)]),
      ...fillBeat(4, 0, [createNote(NoteDuration.EIGHTH, createPitch("B", 2)), createNote(NoteDuration.EIGHTH)]),
      // createNote(1, 0, createPitch("E", 2)),
      // createNote(1, 0, createPitch("B", 2))
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: masterOfPuppetsTempo,
    notes: [
      ...fillBeat(4, 0, [createNote(NoteDuration.EIGHTH, createPitch("D", 3)), createNote(NoteDuration.EIGHTH)]),
      ...fillBeat(4, 0, [createNote(NoteDuration.EIGHTH, createPitch("A", 3)), createNote(NoteDuration.EIGHTH)]),
      ...fillBeat(4, 1, [createNote(NoteDuration.EIGHTH, createPitch("C#", 3)), createNote(NoteDuration.EIGHTH)]),
      ...fillBeat(4, 1, [createNote(NoteDuration.EIGHTH, createPitch("G#", 3)), createNote(NoteDuration.EIGHTH)]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("C", 3))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("G", 3))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("C", 3))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("G", 3))]),
      // createNote(1, 0, createPitch("D", 3)),
      // createNote(1, 0, createPitch("A", 3)),
      // createNote(1, 1, createPitch("C#", 3)),
      // createNote(1, 1, createPitch("G#", 3)),
      // createNote(2, 2, createPitch("C", 3)),
      // createNote(2, 2, createPitch("G", 3)),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: masterOfPuppetsTempo,
    notes: [
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("C", 3))]),
      ...fillBeat(4, 0, [createNote(NoteDuration.QUARTER, createPitch("G", 3))]),
      ...fillBeat(4, 1, [createNote(NoteDuration.QUARTER, createPitch("C", 3))]),
      ...fillBeat(4, 1, [createNote(NoteDuration.QUARTER, createPitch("G", 3))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("C", 3))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("G", 3))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("C", 3))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("G", 3))]),
      // createNote(4, 0, createPitch("C", 3)),
      // createNote(4, 0, createPitch("G", 3))
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: masterOfPuppetsTempo,
    notes: [
      ...fillBeat(4, 0, [
        createNote(NoteDuration.EIGHTH, createPitch("E", 2)),
        createNote(NoteDuration.EIGHTH, createPitch("E", 2)),
      ]),
      ...fillBeat(4, 1, [
        createNote(NoteDuration.EIGHTH, createPitch("E", 3)),
        createNote(NoteDuration.EIGHTH, createPitch("E", 2)),
      ]),
      ...fillBeat(4, 2, [
        createNote(NoteDuration.EIGHTH, createPitch("E", 2)),
        createNote(NoteDuration.EIGHTH, createPitch("D#", 3)),
      ]),
      ...fillBeat(4, 3, [
        createNote(NoteDuration.EIGHTH, createPitch("E", 2)),
        createNote(NoteDuration.EIGHTH, createPitch("E", 2)),
      ]),
      // createNote(1 / 2, 0, createPitch("E", 2)),
      // createNote(1 / 2, 1 / 2, createPitch("E", 2)),
      // createNote(1 / 2, 1, createPitch("E", 3)),
      // createNote(1 / 2, 3 / 2, createPitch("E", 2)),
      // createNote(1 / 2, 2, createPitch("E", 2)),
      // createNote(1 / 2, 5 / 2, createPitch("D#", 3)),
      // createNote(1 / 2, 3, createPitch("E", 2)),
      // createNote(1 / 2, 7 / 2, createPitch("E", 2)),
    ],
  },
  {
    beats: 4,
    dibobinador: 4,
    tempo: masterOfPuppetsTempo,
    notes: [
      ...fillBeat(4, 0, [createNote(NoteDuration.EIGHTH, createPitch("D", 3)), createNote(NoteDuration.EIGHTH)]),
      ...fillBeat(4, 0, [createNote(NoteDuration.EIGHTH, createPitch("A", 3)), createNote(NoteDuration.EIGHTH)]),
      ...fillBeat(4, 1, [createNote(NoteDuration.EIGHTH, createPitch("C#", 3)), createNote(NoteDuration.EIGHTH)]),
      ...fillBeat(4, 1, [createNote(NoteDuration.EIGHTH, createPitch("G#", 3)), createNote(NoteDuration.EIGHTH)]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("C", 3))]),
      ...fillBeat(4, 2, [createNote(NoteDuration.QUARTER, createPitch("G", 3))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("C", 3))]),
      ...fillBeat(4, 3, [createNote(NoteDuration.QUARTER, createPitch("G", 3))]),
      // createNote(1, 0, createPitch("D", 3)),
      // createNote(1, 0, createPitch("A", 3)),
      // createNote(1, 1, createPitch("C#", 3)),
      // createNote(1, 1, createPitch("G#", 3)),
      // createNote(2, 2, createPitch("C", 3)),
      // createNote(2, 2, createPitch("G", 3)),
    ],
  },
  // {
  //   beats: 4,
  //   dibobinador: 4,
  //   tempo: masterOfPuppetsTempo,
  //   notes: [
  //     createNote(1 / 2, 0, createPitch("E", 2)),
  //     createNote(1 / 2, 1 / 2, createPitch("E", 2)),
  //     createNote(1 / 2, 1, createPitch("B", 2)),
  //     createNote(1 / 2, 3 / 2, createPitch("E", 2)),
  //     createNote(1 / 2, 2, createPitch("E", 2)),
  //     createNote(1 / 2, 5 / 2, createPitch("A#", 2)),
  //     createNote(1 / 2, 3, createPitch("E", 2)),
  //     createNote(1 / 2, 7 / 2, createPitch("E", 2)),
  //   ],
  // },
  // {
  //   beats: 4,
  //   dibobinador: 4,
  //   tempo: masterOfPuppetsTempo,
  //   notes: [
  //     createNote(1 / 2, 0, createPitch("A", 2)),
  //     createNote(1 / 2, 1 / 2, createPitch("E", 2)),
  //     createNote(1 / 2, 1, createPitch("G#", 2)),
  //     createNote(1 / 2, 3 / 2, createPitch("E", 2)),
  //     createNote(1 / 2, 2, createPitch("G", 2)),
  //     createNote(1 / 2, 5 / 2, createPitch("E", 2)),
  //     createNote(1 / 2, 3, createPitch("F#", 2)),
  //     createNote(1 / 2, 7 / 2, createPitch("F", 2)),
  //   ],
  // },
  // {
  //   beats: 4,
  //   dibobinador: 4,
  //   tempo: masterOfPuppetsTempo,
  //   notes: [
  //     createNote(1 / 2, 0, createPitch("E", 2)),
  //     createNote(1 / 2, 1 / 2, createPitch("E", 2)),
  //     createNote(1 / 2, 1, createPitch("E", 3)),
  //     createNote(1 / 2, 3 / 2, createPitch("E", 2)),
  //     createNote(1 / 2, 2, createPitch("E", 2)),
  //     createNote(1 / 2, 5 / 2, createPitch("D#", 3)),
  //     createNote(1 / 2, 3, createPitch("E", 2)),
  //     createNote(1 / 2, 7 / 2, createPitch("E", 2)),
  //   ],
  // },
  // {
  //   beats: 4,
  //   dibobinador: 4,
  //   tempo: masterOfPuppetsTempo,
  //   notes: [
  //     createNote(1, 0, createPitch("D", 3)),
  //     createNote(1, 0, createPitch("A", 3)),
  //     createNote(1, 1, createPitch("C#", 3)),
  //     createNote(1, 1, createPitch("G#", 3)),
  //     createNote(2, 2, createPitch("C", 3)),
  //     createNote(2, 2, createPitch("G", 3)),
  //   ],
  // },
];
