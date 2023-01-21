import { addGainNode } from "../../utils/audioContext";
import { addNoteToBar, createBar, setBarNotesTimesInSeconds, type Bar } from "./bar";
import { type Note } from "./note";
import { FrequencyDictionary } from "./pitch";

export type Sheet = {
  bars: Bar[];
  trackCount: number;
  noteToAdd: Note | null;
};

export const createSheet = (trackCount: number) => ({
  bars: [],
  trackCount,
  noteToAdd: null,
});

export const addBarToSheet = (sheet: Sheet, beatCount: number, dibobinador: number, tempo: number) => {
  sheet.bars.push(createBar(sheet.trackCount, beatCount, dibobinador, tempo, sheet.bars.length));
};

export const addNoteToSheet = (sheet: Sheet, barIndex: number, trackIndex: number, note: Note) => {
  if (sheet.bars[barIndex] === undefined) throw new Error("Invalid bar index.");
  if (trackIndex >= sheet.trackCount) throw new Error("Invalid track index.");

  let leftoverNote = addNoteToBar(sheet.bars[barIndex], trackIndex, note);
  let currentBarIndex = barIndex;
  while (leftoverNote !== null) {
    currentBarIndex++;
    if (currentBarIndex >= sheet.bars.length) {
      const lastBar = sheet.bars[currentBarIndex - 1];
      addBarToSheet(sheet, lastBar.beatCount, lastBar.dibobinador, lastBar.tempo);
    }

    leftoverNote = addNoteToBar(sheet.bars[currentBarIndex], trackIndex, leftoverNote);
  }
};

export const removeLastNote = (sheet: Sheet, trackIndex: number) => {
  if (trackIndex >= sheet.trackCount) throw new Error("Invalid track index.");

  //TODO: implement note removal logic
};

export const playSong = (sheet: Sheet, audioContext: AudioContext | null): void => {
  if (!audioContext) return;

  for (let i = 0; i < sheet.bars.length; i++) {
    const bar = sheet.bars[i];
    const baseStart = (bar.beatCount * i) / bar.timeRatio;
    setBarNotesTimesInSeconds(bar);

    const barNotes = bar.tracks.flat();
    for (let j = 0; j < barNotes.length; j++) {
      const note = barNotes[j];
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
