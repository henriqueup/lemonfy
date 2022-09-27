import { createGainNode } from "../functions";
import Note, { NoteDuration } from "./note";
import Pitch, { PitchDictionary } from "./pitch";
const TEMPO_VALUE_IN_SECONDS = 60;

export default class Bar {
  beats: NoteDuration;
  dibobinador: number;
  tempo: number;
  notes: Note[];

  constructor(beats: NoteDuration, dibobinador: number, tempo: number) {
    this.beats = beats;
    this.dibobinador = dibobinador;
    this.tempo = tempo;
    this.notes = [];
  }

  fillBeat(beat: number, notes: Note[]) {
    const notesDurationSum = notes.reduce((currentDuration, currentNote) => currentDuration + currentNote.duration, 0);

    if (notesDurationSum != 1 / this.dibobinador)
      throw new Error(
        `Invalid beat notes, expected total duration: '${1 / this.dibobinador}', actual: '${notesDurationSum}'`,
      );

    let currentStart = beat * (1 / this.dibobinador);
    for (const note of notes) {
      note.start = currentStart;
      currentStart += note.duration;
    }

    this.notes.push(...notes);
  }

  setNotesTimesInSeconds() {
    for (let i = 0; i < this.notes.length; i++) {
      const note = this.notes[i];
      if (note.start == undefined) throw new Error(`Invalid note at ${i}, undefined start.`);

      const timeRatio = getTimeRatio(this.tempo);
      note.durationInSeconds = convertToSeconds(note.duration, this.dibobinador) / timeRatio;
      note.startInSeconds = convertToSeconds(note.start, this.dibobinador) / timeRatio;
    }
  }
}

export const getTimeRatio = (tempo: number) => tempo / TEMPO_VALUE_IN_SECONDS;

export const convertToSeconds = (value: NoteDuration, dibobinador: number) => value * dibobinador;

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
const moonlightSonataBar1 = new Bar(4, 4, moonlightSonataTempo);

moonlightSonataBar1.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("C#", 1))]);
moonlightSonataBar1.fillBeat(1, [new Note(NoteDuration.QUARTER, new Pitch("C#", 1))]);
moonlightSonataBar1.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("C#", 1))]);
moonlightSonataBar1.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("C#", 1))]);
moonlightSonataBar1.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("C#", 2))]);
moonlightSonataBar1.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("C#", 2))]);
moonlightSonataBar1.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("C#", 2))]);
moonlightSonataBar1.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("C#", 2))]);
moonlightSonataBar1.fillBeat(0, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);
moonlightSonataBar1.fillBeat(1, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);
moonlightSonataBar1.fillBeat(2, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);
moonlightSonataBar1.fillBeat(3, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);

moonlightSonataBar1.setNotesTimesInSeconds();
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

const moonlightSonataBar2 = new Bar(4, 4, moonlightSonataTempo);
moonlightSonataBar2.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("B", 0))]);
moonlightSonataBar2.fillBeat(1, [new Note(NoteDuration.QUARTER, new Pitch("B", 0))]);
moonlightSonataBar2.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("B", 0))]);
moonlightSonataBar2.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("B", 0))]);
moonlightSonataBar2.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("B", 1))]);
moonlightSonataBar2.fillBeat(1, [new Note(NoteDuration.QUARTER, new Pitch("B", 1))]);
moonlightSonataBar2.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("B", 1))]);
moonlightSonataBar2.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("B", 1))]);
moonlightSonataBar2.fillBeat(0, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);
moonlightSonataBar2.fillBeat(1, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);
moonlightSonataBar2.fillBeat(2, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);
moonlightSonataBar2.fillBeat(3, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);

moonlightSonataBar2.setNotesTimesInSeconds();
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

const moonlightSonataBar3 = new Bar(4, 4, moonlightSonataTempo);
moonlightSonataBar3.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("A", 0))]);
moonlightSonataBar3.fillBeat(1, [new Note(NoteDuration.QUARTER, new Pitch("A", 0))]);
moonlightSonataBar3.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("F#", 0))]);
moonlightSonataBar3.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("F#", 0))]);
moonlightSonataBar3.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("A", 1))]);
moonlightSonataBar3.fillBeat(1, [new Note(NoteDuration.QUARTER, new Pitch("A", 1))]);
moonlightSonataBar3.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("F#", 1))]);
moonlightSonataBar3.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("F#", 1))]);
moonlightSonataBar3.fillBeat(0, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("A", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);
moonlightSonataBar3.fillBeat(1, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("A", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);
moonlightSonataBar3.fillBeat(2, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("A", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("D", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("F#", 3)),
]);
moonlightSonataBar3.fillBeat(3, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("A", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("D", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("F#", 3)),
]);

moonlightSonataBar3.setNotesTimesInSeconds();
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

const moonlightSonataBar4 = new Bar(4, 4, moonlightSonataTempo);
moonlightSonataBar4.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("G#", 0))]);
moonlightSonataBar4.fillBeat(1, [new Note(NoteDuration.QUARTER, new Pitch("G#", 0))]);
moonlightSonataBar4.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("G#", 0))]);
moonlightSonataBar4.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("G#", 0))]);
moonlightSonataBar4.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("G#", 1))]);
moonlightSonataBar4.fillBeat(1, [new Note(NoteDuration.QUARTER, new Pitch("G#", 1))]);
moonlightSonataBar4.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("G#", 1))]);
moonlightSonataBar4.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("G#", 1))]);
moonlightSonataBar4.fillBeat(0, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("F#", 3)),
]);
moonlightSonataBar4.fillBeat(1, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
]);
moonlightSonataBar4.fillBeat(2, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("D#", 3)),
]);
moonlightSonataBar4.fillBeat(3, [
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("F#", 2)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C", 3)),
  new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("D#", 3)),
]);

moonlightSonataBar4.setNotesTimesInSeconds();
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
const moonlightSonataBars: Bar[] = [moonlightSonataBar1, moonlightSonataBar2, moonlightSonataBar3, moonlightSonataBar4];
export const getMoonlightSonataBars = () => moonlightSonataBars;

const masterOfPuppetsTempo = 212;
const masterOfPuppetsBar1 = new Bar(4, 4, masterOfPuppetsTempo);
masterOfPuppetsBar1.fillBeat(0, [new Note(NoteDuration.EIGHTH, new Pitch("E", 2)), new Note(NoteDuration.EIGHTH)]);
masterOfPuppetsBar1.fillBeat(0, [new Note(NoteDuration.EIGHTH, new Pitch("B", 2)), new Note(NoteDuration.EIGHTH)]);

masterOfPuppetsBar1.setNotesTimesInSeconds();
// createNote(1, 0, createPitch("E", 2)),
// createNote(1, 0, createPitch("B", 2))

const masterOfPuppetsBar2 = new Bar(4, 4, masterOfPuppetsTempo);
masterOfPuppetsBar2.fillBeat(0, [new Note(NoteDuration.EIGHTH, new Pitch("D", 3)), new Note(NoteDuration.EIGHTH)]);
masterOfPuppetsBar2.fillBeat(0, [new Note(NoteDuration.EIGHTH, new Pitch("A", 3)), new Note(NoteDuration.EIGHTH)]);
masterOfPuppetsBar2.fillBeat(1, [new Note(NoteDuration.EIGHTH, new Pitch("C#", 3)), new Note(NoteDuration.EIGHTH)]);
masterOfPuppetsBar2.fillBeat(1, [new Note(NoteDuration.EIGHTH, new Pitch("G#", 3)), new Note(NoteDuration.EIGHTH)]);
masterOfPuppetsBar2.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
masterOfPuppetsBar2.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
masterOfPuppetsBar2.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
masterOfPuppetsBar2.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);

masterOfPuppetsBar2.setNotesTimesInSeconds();
// createNote(1, 0, createPitch("D", 3)),
// createNote(1, 0, createPitch("A", 3)),
// createNote(1, 1, createPitch("C#", 3)),
// createNote(1, 1, createPitch("G#", 3)),
// createNote(2, 2, createPitch("C", 3)),
// createNote(2, 2, createPitch("G", 3)),

const masterOfPuppetsBar3 = new Bar(4, 4, masterOfPuppetsTempo);
masterOfPuppetsBar3.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
masterOfPuppetsBar3.fillBeat(0, [new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
masterOfPuppetsBar3.fillBeat(1, [new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
masterOfPuppetsBar3.fillBeat(1, [new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
masterOfPuppetsBar3.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
masterOfPuppetsBar3.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
masterOfPuppetsBar3.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
masterOfPuppetsBar3.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);

masterOfPuppetsBar3.setNotesTimesInSeconds();
// createNote(4, 0, createPitch("C", 3)),
// createNote(4, 0, createPitch("G", 3))

const masterOfPuppetsBar4 = new Bar(4, 4, masterOfPuppetsTempo);
masterOfPuppetsBar4.fillBeat(0, [
  new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
  new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
]);
masterOfPuppetsBar4.fillBeat(1, [
  new Note(NoteDuration.EIGHTH, new Pitch("E", 3)),
  new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
]);
masterOfPuppetsBar4.fillBeat(2, [
  new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
  new Note(NoteDuration.EIGHTH, new Pitch("D#", 3)),
]);
masterOfPuppetsBar4.fillBeat(3, [
  new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
  new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
]);

masterOfPuppetsBar4.setNotesTimesInSeconds();
// createNote(1 / 2, 0, createPitch("E", 2)),
// createNote(1 / 2, 1 / 2, createPitch("E", 2)),
// createNote(1 / 2, 1, createPitch("E", 3)),
// createNote(1 / 2, 3 / 2, createPitch("E", 2)),
// createNote(1 / 2, 2, createPitch("E", 2)),
// createNote(1 / 2, 5 / 2, createPitch("D#", 3)),
// createNote(1 / 2, 3, createPitch("E", 2)),
// createNote(1 / 2, 7 / 2, createPitch("E", 2)),

const masterOfPuppetsBar5 = new Bar(4, 4, masterOfPuppetsTempo);
masterOfPuppetsBar5.fillBeat(0, [new Note(NoteDuration.EIGHTH, new Pitch("D", 3)), new Note(NoteDuration.EIGHTH)]);
masterOfPuppetsBar5.fillBeat(0, [new Note(NoteDuration.EIGHTH, new Pitch("A", 3)), new Note(NoteDuration.EIGHTH)]);
masterOfPuppetsBar5.fillBeat(1, [new Note(NoteDuration.EIGHTH, new Pitch("C#", 3)), new Note(NoteDuration.EIGHTH)]);
masterOfPuppetsBar5.fillBeat(1, [new Note(NoteDuration.EIGHTH, new Pitch("G#", 3)), new Note(NoteDuration.EIGHTH)]);
masterOfPuppetsBar5.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
masterOfPuppetsBar5.fillBeat(2, [new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
masterOfPuppetsBar5.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
masterOfPuppetsBar5.fillBeat(3, [new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);

masterOfPuppetsBar5.setNotesTimesInSeconds();
// createNote(1, 0, createPitch("D", 3)),
// createNote(1, 0, createPitch("A", 3)),
// createNote(1, 1, createPitch("C#", 3)),
// createNote(1, 1, createPitch("G#", 3)),
// createNote(2, 2, createPitch("C", 3)),
// createNote(2, 2, createPitch("G", 3)),
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

export const getMasterOfPuppetsBars = () => [
  masterOfPuppetsBar1,
  masterOfPuppetsBar2,
  masterOfPuppetsBar3,
  masterOfPuppetsBar4,
  masterOfPuppetsBar5,
];
