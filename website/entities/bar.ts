import { createGainNode } from "../functions";
import Note, { NoteDuration } from "./note";
import { PitchDictionary } from "./pitch";
const SECONDS_PER_MINUTE = 60;

export default class Bar {
  trackCount: number;
  beatCount: number;
  dibobinador: number;
  tempo: number;
  tracks: Note[][];
  timeRatio: number;
  index?: number;

  constructor(trackCount: number, beatCount: number, dibobinador: number, tempo: number, index?: number) {
    this.trackCount = trackCount;
    this.beatCount = beatCount;
    this.dibobinador = dibobinador;
    this.tempo = tempo;
    this.tracks = [];
    this.timeRatio = tempo / SECONDS_PER_MINUTE;
    this.index = index;

    for (let i = 0; i < trackCount; i++) {
      this.tracks[i] = [];
    }
  }

  setNotesTimesInSeconds() {
    const notes = this.tracks.flat();

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.start == undefined) throw new Error(`Invalid note at ${i}, undefined start.`);

      note.durationInSeconds = this.convertToSeconds(note.duration) / this.timeRatio;
      note.startInSeconds = this.convertToSeconds(note.start) / this.timeRatio;
    }
  }

  convertToSeconds(value: NoteDuration) {
    return value * this.dibobinador;
  }

  addNote(trackIndex: number, noteToAdd: Note): Note | null {
    if (trackIndex >= this.tracks.length) throw new Error("Invalid track index.");
    const targetTrack = this.tracks[trackIndex];

    const currentTrackNotesDuration = Note.sumNotesDuration(targetTrack);
    const trackCapacity = this.beatCount / this.dibobinador;

    let actualNoteAdded = noteToAdd;
    let leftoverNote: Note | null = null;

    if (currentTrackNotesDuration + noteToAdd.duration > trackCapacity) {
      const remainingDuration = trackCapacity - currentTrackNotesDuration;

      actualNoteAdded = new Note(remainingDuration, noteToAdd.pitch, true, noteToAdd.isSustain);
      leftoverNote = new Note(noteToAdd.duration - remainingDuration, noteToAdd.pitch, false, true);
    }

    if (targetTrack.length === 0) {
      actualNoteAdded.start = 0;
    } else {
      const previousNote = targetTrack[targetTrack.length - 1];

      if (previousNote.start == null) throw new Error("The previous note must have it's start set.");

      actualNoteAdded.start = previousNote.start + previousNote.duration;
    }

    targetTrack.push(actualNoteAdded);
    return leftoverNote;
  }
}

/*
sources
https://www.youtube.com/watch?v=skFugVOqBM4
https://pages.mtu.edu/~suits/notefreqs.html
https://musescore.com/classicman/scores/55352
*/
// const moonlightSonataTempo = 54;
// const moonlightSonataBar1 = new Bar(4, 4, moonlightSonataTempo);

// moonlightSonataBar1.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C#", 1))]);
// moonlightSonataBar1.beats[1].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C#", 1))]);
// moonlightSonataBar1.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C#", 1))]);
// moonlightSonataBar1.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C#", 1))]);
// moonlightSonataBar1.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C#", 2))]);
// moonlightSonataBar1.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C#", 2))]);
// moonlightSonataBar1.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C#", 2))]);
// moonlightSonataBar1.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C#", 2))]);
// moonlightSonataBar1.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);
// moonlightSonataBar1.beats[1].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);
// moonlightSonataBar1.beats[2].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);
// moonlightSonataBar1.beats[3].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);

// moonlightSonataBar1.setNotesTimesInSeconds();
// // createNote(4, 0, createPitch("C#", 1)),
// // createNote(4, 0, createPitch("C#", 2)),
// // createNote(1 / 3, 0, createPitch("G#", 2)),
// // createNote(1 / 3, 1 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 2 / 3, createPitch("E", 3)),
// // createNote(1 / 3, 1, createPitch("G#", 2)),
// // createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 5 / 3, createPitch("E", 3)),
// // createNote(1 / 3, 2, createPitch("G#", 2)),
// // createNote(1 / 3, 7 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 8 / 3, createPitch("E", 3)),
// // createNote(1 / 3, 3, createPitch("G#", 2)),
// // createNote(1 / 3, 10 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 11 / 3, createPitch("E", 3)),

// const moonlightSonataBar2 = new Bar(4, 4, moonlightSonataTempo);
// moonlightSonataBar2.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("B", 0))]);
// moonlightSonataBar2.beats[1].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("B", 0))]);
// moonlightSonataBar2.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("B", 0))]);
// moonlightSonataBar2.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("B", 0))]);
// moonlightSonataBar2.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("B", 1))]);
// moonlightSonataBar2.beats[1].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("B", 1))]);
// moonlightSonataBar2.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("B", 1))]);
// moonlightSonataBar2.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("B", 1))]);
// moonlightSonataBar2.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);
// moonlightSonataBar2.beats[1].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);
// moonlightSonataBar2.beats[2].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);
// moonlightSonataBar2.beats[3].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);

// moonlightSonataBar2.setNotesTimesInSeconds();
// // createNote(4, 0, createPitch("B", 1)),
// // createNote(4, 0, createPitch("B", 2)),
// // createNote(1 / 3, 0, createPitch("G#", 2)),
// // createNote(1 / 3, 1 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 2 / 3, createPitch("E", 3)),
// // createNote(1 / 3, 1, createPitch("G#", 2)),
// // createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 5 / 3, createPitch("E", 3)),
// // createNote(1 / 3, 2, createPitch("G#", 2)),
// // createNote(1 / 3, 7 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 8 / 3, createPitch("E", 3)),
// // createNote(1 / 3, 3, createPitch("G#", 2)),
// // createNote(1 / 3, 10 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 11 / 3, createPitch("E", 3)),

// const moonlightSonataBar3 = new Bar(4, 4, moonlightSonataTempo);
// moonlightSonataBar3.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("A", 0))]);
// moonlightSonataBar3.beats[1].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("A", 0))]);
// moonlightSonataBar3.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("F#", 0))]);
// moonlightSonataBar3.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("F#", 0))]);
// moonlightSonataBar3.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("A", 1))]);
// moonlightSonataBar3.beats[1].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("A", 1))]);
// moonlightSonataBar3.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("F#", 1))]);
// moonlightSonataBar3.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("F#", 1))]);
// moonlightSonataBar3.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("A", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);
// moonlightSonataBar3.beats[1].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("A", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);
// moonlightSonataBar3.beats[2].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("A", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("D", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("F#", 3)),
// ]);
// moonlightSonataBar3.beats[3].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("A", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("D", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("F#", 3)),
// ]);

// moonlightSonataBar3.setNotesTimesInSeconds();
// // createNote(4, 0, createPitch("A", 0)),
// // createNote(4, 0, createPitch("A", 1)),
// // createNote(1 / 3, 0, createPitch("A", 2)),
// // createNote(1 / 3, 1 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 2 / 3, createPitch("E", 3)),
// // createNote(1 / 3, 1, createPitch("A", 2)),
// // createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 5 / 3, createPitch("E", 3)),
// // createNote(2, 2, createPitch("F#", 0)),
// // createNote(2, 2, createPitch("F#", 1)),
// // createNote(1 / 3, 2, createPitch("A", 2)),
// // createNote(1 / 3, 7 / 3, createPitch("D", 3)),
// // createNote(1 / 3, 8 / 3, createPitch("F#", 3)),
// // createNote(1 / 3, 3, createPitch("A", 2)),
// // createNote(1 / 3, 10 / 3, createPitch("D", 3)),
// // createNote(1 / 3, 11 / 3, createPitch("F#", 3)),

// const moonlightSonataBar4 = new Bar(4, 4, moonlightSonataTempo);
// moonlightSonataBar4.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G#", 0))]);
// moonlightSonataBar4.beats[1].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G#", 0))]);
// moonlightSonataBar4.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G#", 0))]);
// moonlightSonataBar4.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G#", 0))]);
// moonlightSonataBar4.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G#", 1))]);
// moonlightSonataBar4.beats[1].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G#", 1))]);
// moonlightSonataBar4.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G#", 1))]);
// moonlightSonataBar4.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G#", 1))]);
// moonlightSonataBar4.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("F#", 3)),
// ]);
// moonlightSonataBar4.beats[1].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("E", 3)),
// ]);
// moonlightSonataBar4.beats[2].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("G#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("D#", 3)),
// ]);
// moonlightSonataBar4.beats[3].fillBeat([
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("F#", 2)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("C", 3)),
//   new Note(NoteDuration.EIGHTH_TRIPLET, new Pitch("D#", 3)),
// ]);

// moonlightSonataBar4.setNotesTimesInSeconds();
// // createNote(2, 0, createPitch("G#", 0)),
// // createNote(2, 0, createPitch("G#", 1)),
// // createNote(1 / 3, 0, createPitch("G#", 2)),
// // createNote(1 / 3, 1 / 3, createPitch("C", 3)),
// // createNote(1 / 3, 2 / 3, createPitch("F#", 3)),
// // createNote(1 / 3, 1, createPitch("G#", 2)),
// // createNote(1 / 3, 4 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 5 / 3, createPitch("E", 3)),
// // createNote(2, 2, createPitch("G#", 0)),
// // createNote(2, 2, createPitch("G#", 1)),
// // createNote(1 / 3, 2, createPitch("G#", 2)),
// // createNote(1 / 3, 7 / 3, createPitch("C#", 3)),
// // createNote(1 / 3, 8 / 3, createPitch("D#", 3)),
// // createNote(1 / 3, 3, createPitch("F#", 2)),
// // createNote(1 / 3, 10 / 3, createPitch("C", 3)),
// // createNote(1 / 3, 11 / 3, createPitch("D#", 3)),
// const moonlightSonataBars: Bar[] = [moonlightSonataBar1, moonlightSonataBar2, moonlightSonataBar3, moonlightSonataBar4];
// export const getMoonlightSonataBars = () => moonlightSonataBars;

// const masterOfPuppetsTempo = 212;
// const masterOfPuppetsBar1 = new Bar(4, 4, masterOfPuppetsTempo);
// masterOfPuppetsBar1.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
//   new Note(NoteDuration.EIGHTH),
// ]);
// masterOfPuppetsBar1.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("B", 2)),
//   new Note(NoteDuration.EIGHTH),
// ]);

// masterOfPuppetsBar1.setNotesTimesInSeconds();
// // createNote(1, 0, createPitch("E", 2)),
// // createNote(1, 0, createPitch("B", 2))

// const masterOfPuppetsBar2 = new Bar(4, 4, masterOfPuppetsTempo);
// masterOfPuppetsBar2.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("D", 3)),
//   new Note(NoteDuration.EIGHTH),
// ]);
// masterOfPuppetsBar2.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("A", 3)),
//   new Note(NoteDuration.EIGHTH),
// ]);
// masterOfPuppetsBar2.beats[1].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH),
// ]);
// masterOfPuppetsBar2.beats[1].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("G#", 3)),
//   new Note(NoteDuration.EIGHTH),
// ]);
// masterOfPuppetsBar2.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
// masterOfPuppetsBar2.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
// masterOfPuppetsBar2.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
// masterOfPuppetsBar2.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);

// masterOfPuppetsBar2.setNotesTimesInSeconds();
// // createNote(1, 0, createPitch("D", 3)),
// // createNote(1, 0, createPitch("A", 3)),
// // createNote(1, 1, createPitch("C#", 3)),
// // createNote(1, 1, createPitch("G#", 3)),
// // createNote(2, 2, createPitch("C", 3)),
// // createNote(2, 2, createPitch("G", 3)),

// const masterOfPuppetsBar3 = new Bar(4, 4, masterOfPuppetsTempo);
// masterOfPuppetsBar3.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
// masterOfPuppetsBar3.beats[0].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
// masterOfPuppetsBar3.beats[1].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
// masterOfPuppetsBar3.beats[1].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
// masterOfPuppetsBar3.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
// masterOfPuppetsBar3.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
// masterOfPuppetsBar3.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
// masterOfPuppetsBar3.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);

// masterOfPuppetsBar3.setNotesTimesInSeconds();
// // createNote(4, 0, createPitch("C", 3)),
// // createNote(4, 0, createPitch("G", 3))

// const masterOfPuppetsBar4 = new Bar(4, 4, masterOfPuppetsTempo);
// masterOfPuppetsBar4.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
//   new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
// ]);
// masterOfPuppetsBar4.beats[1].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("E", 3)),
//   new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
// ]);
// masterOfPuppetsBar4.beats[2].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
//   new Note(NoteDuration.EIGHTH, new Pitch("D#", 3)),
// ]);
// masterOfPuppetsBar4.beats[3].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
//   new Note(NoteDuration.EIGHTH, new Pitch("E", 2)),
// ]);

// masterOfPuppetsBar4.setNotesTimesInSeconds();
// // createNote(1 / 2, 0, createPitch("E", 2)),
// // createNote(1 / 2, 1 / 2, createPitch("E", 2)),
// // createNote(1 / 2, 1, createPitch("E", 3)),
// // createNote(1 / 2, 3 / 2, createPitch("E", 2)),
// // createNote(1 / 2, 2, createPitch("E", 2)),
// // createNote(1 / 2, 5 / 2, createPitch("D#", 3)),
// // createNote(1 / 2, 3, createPitch("E", 2)),
// // createNote(1 / 2, 7 / 2, createPitch("E", 2)),

// const masterOfPuppetsBar5 = new Bar(4, 4, masterOfPuppetsTempo);
// masterOfPuppetsBar5.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("D", 3)),
//   new Note(NoteDuration.EIGHTH),
// ]);
// masterOfPuppetsBar5.beats[0].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("A", 3)),
//   new Note(NoteDuration.EIGHTH),
// ]);
// masterOfPuppetsBar5.beats[1].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("C#", 3)),
//   new Note(NoteDuration.EIGHTH),
// ]);
// masterOfPuppetsBar5.beats[1].fillBeat([
//   new Note(NoteDuration.EIGHTH, new Pitch("G#", 3)),
//   new Note(NoteDuration.EIGHTH),
// ]);
// masterOfPuppetsBar5.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
// masterOfPuppetsBar5.beats[2].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);
// masterOfPuppetsBar5.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("C", 3))]);
// masterOfPuppetsBar5.beats[3].fillBeat([new Note(NoteDuration.QUARTER, new Pitch("G", 3))]);

// masterOfPuppetsBar5.setNotesTimesInSeconds();
// // createNote(1, 0, createPitch("D", 3)),
// // createNote(1, 0, createPitch("A", 3)),
// // createNote(1, 1, createPitch("C#", 3)),
// // createNote(1, 1, createPitch("G#", 3)),
// // createNote(2, 2, createPitch("C", 3)),
// // createNote(2, 2, createPitch("G", 3)),
// // {
// //   beats: 4,
// //   dibobinador: 4,
// //   tempo: masterOfPuppetsTempo,
// //   notes: [
// //     createNote(1 / 2, 0, createPitch("E", 2)),
// //     createNote(1 / 2, 1 / 2, createPitch("E", 2)),
// //     createNote(1 / 2, 1, createPitch("B", 2)),
// //     createNote(1 / 2, 3 / 2, createPitch("E", 2)),
// //     createNote(1 / 2, 2, createPitch("E", 2)),
// //     createNote(1 / 2, 5 / 2, createPitch("A#", 2)),
// //     createNote(1 / 2, 3, createPitch("E", 2)),
// //     createNote(1 / 2, 7 / 2, createPitch("E", 2)),
// //   ],
// // },
// // {
// //   beats: 4,
// //   dibobinador: 4,
// //   tempo: masterOfPuppetsTempo,
// //   notes: [
// //     createNote(1 / 2, 0, createPitch("A", 2)),
// //     createNote(1 / 2, 1 / 2, createPitch("E", 2)),
// //     createNote(1 / 2, 1, createPitch("G#", 2)),
// //     createNote(1 / 2, 3 / 2, createPitch("E", 2)),
// //     createNote(1 / 2, 2, createPitch("G", 2)),
// //     createNote(1 / 2, 5 / 2, createPitch("E", 2)),
// //     createNote(1 / 2, 3, createPitch("F#", 2)),
// //     createNote(1 / 2, 7 / 2, createPitch("F", 2)),
// //   ],
// // },
// // {
// //   beats: 4,
// //   dibobinador: 4,
// //   tempo: masterOfPuppetsTempo,
// //   notes: [
// //     createNote(1 / 2, 0, createPitch("E", 2)),
// //     createNote(1 / 2, 1 / 2, createPitch("E", 2)),
// //     createNote(1 / 2, 1, createPitch("E", 3)),
// //     createNote(1 / 2, 3 / 2, createPitch("E", 2)),
// //     createNote(1 / 2, 2, createPitch("E", 2)),
// //     createNote(1 / 2, 5 / 2, createPitch("D#", 3)),
// //     createNote(1 / 2, 3, createPitch("E", 2)),
// //     createNote(1 / 2, 7 / 2, createPitch("E", 2)),
// //   ],
// // },
// // {
// //   beats: 4,
// //   dibobinador: 4,
// //   tempo: masterOfPuppetsTempo,
// //   notes: [
// //     createNote(1, 0, createPitch("D", 3)),
// //     createNote(1, 0, createPitch("A", 3)),
// //     createNote(1, 1, createPitch("C#", 3)),
// //     createNote(1, 1, createPitch("G#", 3)),
// //     createNote(2, 2, createPitch("C", 3)),
// //     createNote(2, 2, createPitch("G", 3)),
// //   ],
// // },

// export const getMasterOfPuppetsBars = () => [
//   masterOfPuppetsBar1,
//   masterOfPuppetsBar2,
//   masterOfPuppetsBar3,
//   masterOfPuppetsBar4,
//   masterOfPuppetsBar5,
// ];
