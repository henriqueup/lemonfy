import { addGainNode } from "../../utils/audioContext";
import { createBar, fillBarTrackFromSheet, setBarNotesTimesInSeconds, sumBarsCapacity, type Bar } from "./bar";
import { type Note } from "./note";
import { FrequencyDictionary } from "./pitch";
import { TimeEvaluation } from "./timeEvaluation";

export type Sheet = {
  bars: Bar[];
  tracks: Note[][];
  trackCount: number;
  noteToAdd: Note | null;
};

export const createSheet = (trackCount: number): Sheet => {
  const newSheet: Sheet = {
    bars: [],
    tracks: [],
    trackCount,
    noteToAdd: null,
  };

  for (let i = 0; i < trackCount; i++) {
    newSheet.tracks[i] = [];
  }

  return newSheet;
};

export const addBarToSheet = (sheet: Sheet, beatCount: number, dibobinador: number, tempo: number) => {
  const newBarStart = sumBarsCapacity(sheet.bars);

  sheet.bars.push(createBar(sheet.trackCount, beatCount, dibobinador, newBarStart, tempo, sheet.bars.length));
};

const getTrackFromIndex = (sheet: Sheet, trackIndex: number) => {
  if (trackIndex >= sheet.tracks.length || trackIndex < 0) throw new Error("Invalid track index.");

  const targetTrack = sheet.tracks[trackIndex];
  if (targetTrack === undefined) throw new Error(`Invalid track at index: ${trackIndex}.`);

  return targetTrack;
};

const addExtraBarsIfNeeded = (sheet: Sheet, trackIndex: number) => {
  const targetTrack = getTrackFromIndex(sheet, trackIndex);

  const lastNote = targetTrack[targetTrack.length - 1];
  if (lastNote === undefined) throw new Error("Track should have at least one Note.");

  let lastBar = sheet.bars[sheet.bars.length - 1];
  if (lastBar === undefined) throw new Error("Sheet should have ate least one Bar.");

  const lastNoteEnd = lastNote.start + lastNote.duration;
  let lastBarEnd = lastBar.start + lastBar.capacity;

  while (lastNoteEnd > lastBarEnd) {
    addBarToSheet(sheet, lastBar.beatCount, lastBar.dibobinador, lastBar.tempo);

    lastBar = sheet.bars[sheet.bars.length - 1];
    if (lastBar === undefined) return;

    lastBarEnd = lastBar.start + lastBar.capacity;
  }
};

const adjustNoteStartsAfterNewNote = (track: Note[], newNote: Note, newNoteIndex: number) => {
  let amountToIncrease: number | undefined;
  let previousNote = newNote;

  for (let i = newNoteIndex + 1; i < track.length; i++) {
    const currentNote = track[i];
    if (currentNote === undefined) throw new Error(`The note at ${i} must exist.`);

    const startDifference = currentNote.start - previousNote.start;
    amountToIncrease = previousNote.duration - startDifference;
    if (TimeEvaluation.IsSmallerOrEqualTo(amountToIncrease, 0)) break;

    currentNote.start += amountToIncrease;
    previousNote = currentNote;
  }
};

export const addNoteToSheet = (sheet: Sheet, trackIndex: number, noteToAdd: Note) => {
  const targetTrack = getTrackFromIndex(sheet, trackIndex);
  const notesBeforeNoteToAdd = targetTrack.filter(note => TimeEvaluation.IsSmallerThan(note.start, noteToAdd.start));

  let noteToAddIndex = 0;
  if (notesBeforeNoteToAdd.length > 0) {
    const lastNoteBeforeNoteToAdd = notesBeforeNoteToAdd[notesBeforeNoteToAdd.length - 1];

    if (lastNoteBeforeNoteToAdd === undefined)
      throw new Error(`Note at index ${notesBeforeNoteToAdd.length - 1} should exist.`);

    noteToAddIndex = targetTrack.indexOf(lastNoteBeforeNoteToAdd) + 1;
  }

  const resultingTrack = [...targetTrack.slice(0, noteToAddIndex), noteToAdd, ...targetTrack.slice(noteToAddIndex)];
  adjustNoteStartsAfterNewNote(resultingTrack, noteToAdd, noteToAddIndex);

  sheet.tracks[trackIndex] = resultingTrack;
  addExtraBarsIfNeeded(sheet, trackIndex);
};

export const findSheetNoteByTime = (
  sheet: Sheet,
  trackIndex: number,
  time: number,
  lookForward = true,
): Note | null => {
  const track = getTrackFromIndex(sheet, trackIndex);

  const targetNote = track.find(note => {
    const noteEnd = note.start + note.duration;
    if (lookForward)
      return TimeEvaluation.IsSmallerOrEqualTo(note.start, time) && TimeEvaluation.IsSmallerThan(time, noteEnd);

    return TimeEvaluation.IsSmallerThan(note.start, time) && TimeEvaluation.IsSmallerOrEqualTo(time, noteEnd);
  });

  return targetNote ?? null;
};

export const removeNotesFromSheet = (sheet: Sheet, trackIndex: number, notesToRemove: Note[]): void => {
  const track = getTrackFromIndex(sheet, trackIndex);

  sheet.tracks[trackIndex] = track.filter(note => !notesToRemove.includes(note));
};

export const fillBarTracksInSheet = (sheet: Sheet, trackIndex: number) => {
  for (let i = 0; i < sheet.bars.length; i++) {
    fillBarTrackFromSheet(sheet, i, trackIndex);
  }
};

const fillBarsInSheet = (sheet: Sheet) => {
  for (let i = 0; i < sheet.tracks.length; i++) {
    fillBarTracksInSheet(sheet, i);
  }
};

export const playSong = (sheet: Sheet, audioContext: AudioContext | null): void => {
  if (!audioContext) return;

  fillBarsInSheet(sheet);

  for (let i = 0; i < sheet.bars.length; i++) {
    const bar = sheet.bars[i];
    if (bar === undefined) throw new Error(`Invalid bar at index ${i}.`);

    const baseStart = (bar.beatCount * i) / bar.timeRatio;
    setBarNotesTimesInSeconds(bar);

    const barNotes = bar.tracks.flat();
    for (let j = 0; j < barNotes.length; j++) {
      const note = barNotes[j];
      if (note === undefined) throw new Error(`Invalid note at index ${j}.`);

      if (note.startInSeconds == undefined)
        throw new Error(`Invalid note: '${j}' on bar '${i}', undefined startInSeconds.`);
      if (note.durationInSeconds == undefined)
        throw new Error(`Invalid note: '${j}' on bar '${i}', undefined durationInSeconds.`);

      const oscillator = audioContext.createOscillator();
      const gainNode = addGainNode(audioContext);

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + baseStart + note.startInSeconds);
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
      oscillator.frequency.value = note.pitch?.key ? FrequencyDictionary[note.pitch.key] : 0;
      oscillator.start();
    }
  }
};
