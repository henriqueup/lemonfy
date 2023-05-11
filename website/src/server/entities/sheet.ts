import { z } from "zod";

import { default as BarModule, BarSchema } from "./bar";
import { type Note, NoteSchema } from "./note";
import { TimeEvaluation } from "./timeEvaluation";

export const SheetSchema = z.object({
  bars: z.array(BarSchema),
  tracks: z.array(z.array(NoteSchema)),
  trackCount: z.number().int().min(1),
});

export type Sheet = z.infer<typeof SheetSchema>;

interface ISheetModule {
  findSheetNoteByTime: (
    sheet: Sheet,
    trackIndex: number,
    time: number,
    lookForward?: boolean,
  ) => Note | null;

  createSheet: (trackCount: number) => Sheet;
  addBarToSheet: (
    sheet: Sheet,
    beatCount: number,
    dibobinador: number,
    tempo: number,
    index?: number,
  ) => void;
  addNoteToSheet: (sheet: Sheet, trackIndex: number, noteToAdd: Note) => void;
  removeNotesFromSheet: (
    sheet: Sheet,
    trackIndex: number,
    notesToRemove: Note[],
  ) => void;
  fillBarTracksInSheet: (sheet: Sheet, trackIndex: number) => void;
  fillBarsInSheet: (sheet: Sheet) => void;
  removeBarInSheetByIndex: (sheet: Sheet, barIndex: number) => void;
}

const SheetModule: ISheetModule = {
  createSheet: (trackCount: number): Sheet => {
    const newSheet: Sheet = {
      bars: [],
      tracks: [],
      trackCount,
    };

    for (let i = 0; i < trackCount; i++) {
      newSheet.tracks[i] = [];
    }

    return SheetSchema.parse(newSheet);
  },

  addBarToSheet: (
    sheet: Sheet,
    beatCount: number,
    dibobinador: number,
    tempo: number,
    index?: number,
  ) => {
    let previousBars = sheet.bars;
    if (index != undefined)
      previousBars = previousBars.filter((_, i) => i <= index);

    const barBeforeNewBar = previousBars[previousBars.length - 1];

    if (barBeforeNewBar !== undefined) {
      const lastNotesOfBarBeforeNewBar = barBeforeNewBar.tracks.map(
        track => track[track.length - 1],
      );
      const lastNotesWithSustain = lastNotesOfBarBeforeNewBar.filter(
        note => note?.hasSustain,
      );

      if (lastNotesWithSustain.length > 0)
        throw new Error(
          "The previous bar can't have any notes with sustain for a new bar to be added after it.",
        );
    }

    const newBarStart = BarModule.sumBarsCapacity(previousBars);
    const newBarIndex = index === undefined ? sheet.bars.length : index + 1;
    const newBar = BarModule.createBar(
      sheet.trackCount,
      beatCount,
      dibobinador,
      newBarStart,
      tempo,
      newBarIndex,
    );

    sheet.bars.splice(newBarIndex, 0, newBar);

    const followingBars = sheet.bars.filter((_, i) => i > newBarIndex);
    followingBars.forEach(bar => {
      bar.index += 1;
    });
  },

  addNoteToSheet: (sheet: Sheet, trackIndex: number, noteToAdd: Note) => {
    const targetTrack = getTrackFromIndex(sheet, trackIndex);
    const notesBeforeNoteToAdd = targetTrack.filter(note =>
      TimeEvaluation.IsSmallerThan(note.start, noteToAdd.start),
    );

    let noteToAddIndex = 0;
    if (notesBeforeNoteToAdd.length > 0) {
      const lastNoteBeforeNoteToAdd =
        notesBeforeNoteToAdd[notesBeforeNoteToAdd.length - 1];

      if (lastNoteBeforeNoteToAdd === undefined)
        throw new Error(
          `Note at index ${notesBeforeNoteToAdd.length - 1} should exist.`,
        );

      noteToAddIndex = targetTrack.indexOf(lastNoteBeforeNoteToAdd) + 1;
    }

    const resultingTrack = [
      ...targetTrack.slice(0, noteToAddIndex),
      noteToAdd,
      ...targetTrack.slice(noteToAddIndex),
    ];
    adjustNoteStartsAfterNewNote(resultingTrack, noteToAdd, noteToAddIndex);

    sheet.tracks[trackIndex] = resultingTrack;
    addExtraBarsIfNeeded(sheet, trackIndex);
  },

  findSheetNoteByTime: (
    sheet: Sheet,
    trackIndex: number,
    time: number,
    lookForward = true,
  ): Note | null => {
    const track = getTrackFromIndex(sheet, trackIndex);

    const targetNote = track.find(note => {
      const noteEnd = note.start + note.duration;
      if (lookForward)
        return (
          TimeEvaluation.IsSmallerOrEqualTo(note.start, time) &&
          TimeEvaluation.IsSmallerThan(time, noteEnd)
        );

      return (
        TimeEvaluation.IsSmallerThan(note.start, time) &&
        TimeEvaluation.IsSmallerOrEqualTo(time, noteEnd)
      );
    });

    return targetNote ?? null;
  },

  removeNotesFromSheet: (
    sheet: Sheet,
    trackIndex: number,
    notesToRemove: Note[],
  ): void => {
    const track = getTrackFromIndex(sheet, trackIndex);

    sheet.tracks[trackIndex] = track.filter(
      note => !notesToRemove.includes(note),
    );
  },

  fillBarTracksInSheet: (sheet: Sheet, trackIndex: number) => {
    for (let i = 0; i < sheet.bars.length; i++) {
      fillBarTrackInSheet(sheet, i, trackIndex);
    }
  },

  fillBarsInSheet: (sheet: Sheet) => {
    for (let i = 0; i < sheet.tracks.length; i++) {
      SheetModule.fillBarTracksInSheet(sheet, i);
    }
  },

  removeBarInSheetByIndex: (sheet: Sheet, barIndex: number) => {
    const barToRemove = sheet.bars[barIndex];
    if (barToRemove === undefined)
      throw new Error(`Invalid bar at index ${barIndex}.`);

    sheet.bars.splice(barIndex, 1);

    // decrease index of all following bars
    for (let i = barIndex; i < sheet.bars.length; i++) {
      const bar = sheet.bars[i];
      if (bar === undefined) throw new Error(`Invalid bar at index ${i}.`);

      bar.index -= 1;
    }

    sheet.tracks = sheet.tracks.map(track =>
      track.filter(
        note =>
          note.start + note.duration <= barToRemove.start ||
          note.start >= barToRemove.start + barToRemove.capacity,
      ),
    );

    SheetModule.fillBarsInSheet(sheet);
  },
};

const getTrackFromIndex = (sheet: Sheet, trackIndex: number) => {
  if (trackIndex >= sheet.tracks.length || trackIndex < 0)
    throw new Error("Invalid track index.");

  const targetTrack = sheet.tracks[trackIndex];
  if (targetTrack === undefined)
    throw new Error(`Invalid track at index: ${trackIndex}.`);

  return targetTrack;
};

const addExtraBarsIfNeeded = (sheet: Sheet, trackIndex: number) => {
  const targetTrack = getTrackFromIndex(sheet, trackIndex);

  const lastNote = targetTrack[targetTrack.length - 1];
  if (lastNote === undefined)
    throw new Error("Track should have at least one Note.");

  let lastBar = sheet.bars[sheet.bars.length - 1];
  if (lastBar === undefined)
    throw new Error("Sheet should have ate least one Bar.");

  const lastNoteEnd = lastNote.start + lastNote.duration;
  let lastBarEnd = lastBar.start + lastBar.capacity;

  while (lastNoteEnd > lastBarEnd) {
    SheetModule.addBarToSheet(
      sheet,
      lastBar.beatCount,
      lastBar.dibobinador,
      lastBar.tempo,
    );

    lastBar = sheet.bars[sheet.bars.length - 1];
    if (lastBar === undefined) return;

    lastBarEnd = lastBar.start + lastBar.capacity;
  }
};

const adjustNoteStartsAfterNewNote = (
  track: Note[],
  newNote: Note,
  newNoteIndex: number,
) => {
  let amountToIncrease: number | undefined;
  let previousNote = newNote;

  for (let i = newNoteIndex + 1; i < track.length; i++) {
    const currentNote = track[i];
    if (currentNote === undefined)
      throw new Error(`The note at ${i} must exist.`);

    const startDifference = currentNote.start - previousNote.start;
    amountToIncrease = previousNote.duration - startDifference;
    if (TimeEvaluation.IsSmallerOrEqualTo(amountToIncrease, 0)) break;

    currentNote.start += amountToIncrease;
    previousNote = currentNote;
  }
};

const fillBarTrackInSheet = (
  sheet: Sheet,
  barIndex: number,
  trackIndex: number,
) => {
  const targetBar = sheet.bars[barIndex];
  if (targetBar === undefined)
    throw new Error(`Bar at index ${barIndex} should exist.`);

  const sheetTrack = sheet.tracks[trackIndex];
  if (sheetTrack === undefined)
    throw new Error(`Track at index ${trackIndex} should exist.`);

  if (sheetTrack.length === 0) {
    targetBar.tracks[trackIndex] = [];
    return;
  }

  BarModule.fillBarTrack(targetBar, sheetTrack, trackIndex);
};

export default SheetModule;
