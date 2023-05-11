import { z } from "zod";
import { createNote, NoteSchema, type Note } from "./note";
import { SECONDS_PER_MINUTE, TimeEvaluation } from "./timeEvaluation";

export const BarSchema = z.object({
  id: z.string().cuid().optional(),
  trackCount: z.number().int().min(1),
  beatCount: z.number().int().min(1),
  dibobinador: z.number().int().min(1),
  start: z.number().min(0),
  startInSeconds: z.number().min(0).optional(),
  capacity: z.number().gt(0),
  tempo: z.number().int().min(1),
  tracks: z.array(z.array(NoteSchema)),
  timeRatio: z.number().gt(0),
  index: z.number().min(0),
});

export type Bar = z.infer<typeof BarSchema>;

interface IBarModule {
  createBar: (
    trackCount: number,
    beatCount: number,
    dibobinador: number,
    start: number,
    tempo: number,
    index: number,
    id?: string,
  ) => Bar;
  findBarNoteByTime: (
    bar: Bar,
    trackIndex: number,
    time: number,
    lookForward?: boolean,
    shouldContainTime?: boolean,
  ) => Note | null;

  sumBarsCapacity: (bars: Bar[]) => number;
  convertDurationInBarToSeconds: (bar: Bar, duration: number) => number;
  setBarTimesInSeconds: (bar: Bar) => void;
  fillBarTrack: (bar: Bar, track: Note[], trackIndex: number) => void;
  cropBar: (bar: Bar, start: number) => void;
}

const BarModule: IBarModule = {
  createBar: (
    trackCount: number,
    beatCount: number,
    dibobinador: number,
    start: number,
    tempo: number,
    index: number,
    id?: string,
  ): Bar => {
    return BarSchema.parse({
      id,
      trackCount,
      beatCount,
      dibobinador,
      start,
      capacity: beatCount / dibobinador,
      tempo,
      tracks: Array.from({ length: trackCount }, (): Note[] => []),
      timeRatio: tempo / SECONDS_PER_MINUTE,
      index,
    });
  },

  findBarNoteByTime: (
    bar: Bar,
    trackIndex: number,
    time: number,
    lookForward = true,
    shouldContainTime = true,
  ): Note | null => {
    const track = [...getTrackFromIndex(bar, trackIndex)];

    if (!lookForward) track.reverse();

    const targetNote = track.find(note => {
      const noteEnd = note.start + note.duration;
      if (lookForward)
        return (
          (TimeEvaluation.IsSmallerOrEqualTo(note.start, time) &&
            TimeEvaluation.IsSmallerThan(time, noteEnd)) ||
          (!shouldContainTime && TimeEvaluation.IsSmallerThan(time, note.start))
        );

      return (
        (TimeEvaluation.IsSmallerThan(note.start, time) &&
          TimeEvaluation.IsSmallerOrEqualTo(time, noteEnd)) ||
        (!shouldContainTime && TimeEvaluation.IsSmallerThan(noteEnd, time))
      );
    });

    return targetNote ?? null;
  },

  sumBarsCapacity: (bars: Bar[]): number => {
    return bars.reduce(
      (currentCapacity, currentBar) => currentCapacity + currentBar.capacity,
      0,
    );
  },

  convertDurationInBarToSeconds: (bar: Bar, duration: number): number => {
    return (duration * bar.dibobinador) / bar.timeRatio;
  },

  setBarTimesInSeconds: (bar: Bar): void => {
    const notes = bar.tracks.flat();
    bar.startInSeconds = BarModule.convertDurationInBarToSeconds(
      bar,
      bar.start,
    );

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note === undefined)
        throw new Error(`The note at index ${i} should exist.`);

      note.durationInSeconds = BarModule.convertDurationInBarToSeconds(
        bar,
        note.duration,
      );
      note.startInSeconds = BarModule.convertDurationInBarToSeconds(
        bar,
        note.start,
      );
    }
  },

  fillBarTrack: (bar: Bar, track: Note[], trackIndex: number): void => {
    const barEnd = bar.start + bar.capacity;
    const notesInsideBar = track.filter(
      note =>
        TimeEvaluation.IsGreaterThan(note.start + note.duration, bar.start) &&
        TimeEvaluation.IsSmallerThan(note.start, barEnd),
    );
    if (notesInsideBar.length === 0) {
      bar.tracks[trackIndex] = [];
      return;
    }

    const firstNote = notesInsideBar[0];
    if (firstNote === undefined) throw Error("Invalid first Note of track.");

    const lastNote = notesInsideBar[notesInsideBar.length - 1];
    if (lastNote === undefined) throw Error("Invalid last Note of track.");

    const trackWithoutExtremityNotes = notesInsideBar
      .filter((_, i) => i !== 0 && i !== notesInsideBar.length - 1)
      .map(trackNote =>
        createNote(trackNote.duration, trackNote.start, trackNote.pitch),
      );
    const barTrack = trackWithoutExtremityNotes;

    const actualFirstNote = getActualFirstNote(bar, firstNote);
    barTrack.splice(0, 0, actualFirstNote);

    if (lastNote !== firstNote) {
      const actualLastNote = getActualLastNote(bar, lastNote);
      barTrack.push(actualLastNote);
    }

    barTrack.forEach(note => {
      note.start -= bar.start;
    });
    bar.tracks[trackIndex] = barTrack;
  },

  cropBar: (bar: Bar, start: number): void => {
    if (bar.start >= start || bar.start + bar.capacity <= start) return;

    const startAdjustedToBar = start - bar.start;
    for (let i = 0; i < bar.tracks.length; i++) {
      const track = bar.tracks[i];
      if (track === undefined) throw new Error(`Invalid bar track at ${i}.`);

      const noteToCrop = BarModule.findBarNoteByTime(
        bar,
        i,
        startAdjustedToBar,
      );
      const croppedNote = noteToCrop;

      if (croppedNote !== null && croppedNote.start < startAdjustedToBar) {
        croppedNote.duration -= startAdjustedToBar - croppedNote.start;
        croppedNote.start = startAdjustedToBar;
      }

      bar.tracks[i] = track
        .filter(note => note.start >= startAdjustedToBar)
        .map(note => ({ ...note, start: note.start - startAdjustedToBar }));
    }

    bar.capacity -= startAdjustedToBar;
  },
};

const getTrackFromIndex = (bar: Bar, trackIndex: number) => {
  if (trackIndex >= bar.tracks.length || trackIndex < 0)
    throw new Error("Invalid track index.");

  const targetTrack = bar.tracks[trackIndex];
  if (targetTrack === undefined)
    throw new Error(`Invalid track at index: ${trackIndex}.`);

  return targetTrack;
};

const getActualFirstNote = (bar: Bar, firstNote: Note) => {
  const firstNoteEnd = firstNote.start + firstNote.duration;
  const targetBarEnd = bar.start + bar.capacity;
  const shouldHaveSustain = TimeEvaluation.IsGreaterThan(
    firstNoteEnd,
    targetBarEnd,
  );
  const shouldBeSustain = TimeEvaluation.IsSmallerThan(
    firstNote.start,
    bar.start,
  );

  let start = firstNote.start;
  let duration = firstNote.duration;

  if (shouldBeSustain) {
    start = bar.start;
    duration = firstNoteEnd - bar.start;
  }

  if (shouldHaveSustain) {
    duration = bar.capacity;
  }

  return createNote(
    duration,
    start,
    firstNote.pitch,
    shouldHaveSustain,
    shouldBeSustain,
  );
};

const getActualLastNote = (bar: Bar, lastNote: Note) => {
  const lastNoteEnd = lastNote.start + lastNote.duration;
  const targetBarEnd = bar.start + bar.capacity;
  const shouldHaveSustain = TimeEvaluation.IsGreaterThan(
    lastNoteEnd,
    targetBarEnd,
  );
  const duration = shouldHaveSustain
    ? targetBarEnd - lastNote.start
    : lastNote.duration;

  return createNote(
    duration,
    lastNote.start,
    lastNote.pitch,
    shouldHaveSustain,
    false,
  );
};

export default BarModule;

/*
sources
https://www.youtube.com/watch?v=skFugVOqBM4
https://pages.mtu.edu/~suits/notefreqs.html
https://musescore.com/classicman/scores/55352
*/

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
