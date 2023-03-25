import { play } from "@store/player/playerActions";
import { addGainNode } from "../../utils/audioContext";
import { createBar, fillBarTrack, setBarTimesInSeconds, sumBarsCapacity, type Bar } from "./bar";
import type { Note } from "./note";
import { TimeEvaluation } from "./timeEvaluation";

export type Sheet = {
  bars: Bar[];
  tracks: Note[][];
  trackCount: number;
};

export const createSheet = (trackCount: number): Sheet => {
  const newSheet: Sheet = {
    bars: [],
    tracks: [],
    trackCount,
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

const fillBarTrackInSheet = (sheet: Sheet, barIndex: number, trackIndex: number) => {
  const targetBar = sheet.bars[barIndex];
  if (targetBar === undefined) throw new Error(`Bar at index ${barIndex} should exist.`);

  const sheetTrack = sheet.tracks[trackIndex];
  if (sheetTrack === undefined) throw new Error(`Track at index ${trackIndex} should exist.`);

  if (sheetTrack.length === 0) {
    targetBar.tracks[trackIndex] = [];
    return;
  }

  fillBarTrack(targetBar, sheetTrack, trackIndex);
};

export const fillBarTracksInSheet = (sheet: Sheet, trackIndex: number) => {
  for (let i = 0; i < sheet.bars.length; i++) {
    fillBarTrackInSheet(sheet, i, trackIndex);
  }
};

const fillBarsInSheet = (sheet: Sheet) => {
  for (let i = 0; i < sheet.tracks.length; i++) {
    fillBarTracksInSheet(sheet, i);
  }
};

export const removeBarInSheetByIndex = (sheet: Sheet, barIndex: number) => {
  const barToRemove = sheet.bars[barIndex];
  if (barToRemove === undefined) throw new Error(`Invalid bar at index ${barIndex}.`);

  sheet.bars.splice(barIndex, 1);
  sheet.tracks = sheet.tracks.map(track =>
    track.filter(
      note => note.start + note.duration <= barToRemove.start || note.start >= barToRemove.start + barToRemove.capacity,
    ),
  );

  fillBarsInSheet(sheet);
};

export const playSong = (sheet: Sheet, audioContext: AudioContext | null): void => {
  if (!audioContext) return;

  fillBarsInSheet(sheet);

  for (let i = 0; i < sheet.bars.length; i++) {
    const bar = sheet.bars[i];
    if (bar === undefined) throw new Error(`Invalid bar at index ${i}.`);

    setBarTimesInSeconds(bar);
    if (bar.startInSeconds == undefined) throw new Error(`Invalid bar at ${i}: undefined startInSeconds.`);

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
      const noteEndInSeconds = note.startInSeconds + note.durationInSeconds;
      const gainValueWhilePlaying = 0.2;

      gainNode.gain.setValueAtTime(
        gainValueWhilePlaying,
        audioContext.currentTime + bar.startInSeconds + note.startInSeconds,
      );
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + bar.startInSeconds + noteEndInSeconds);
      oscillator.connect(gainNode);

      //no clue wtf is going on here... gotta learn about sound wave synthesis, I guess
      const sineTerms = new Float32Array([1, 1, 1, 0, 1, 1, 0, 0, 1]);
      const cosineTerms = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1]);
      const customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

      oscillator.setPeriodicWave(customWaveform);
      oscillator.frequency.value = note.pitch?.frequency || 0;
      oscillator.start();
    }
  }

  play();
};
