import { createGainNode } from "../functions";
import Bar from "./bar";
import Note from "./note";
import { PitchDictionary } from "./pitch";

export default class Sheet {
  bars: Bar[];
  trackCount: number;
  noteToAdd: Note | null;

  constructor(trackCount: number) {
    this.bars = [];
    this.trackCount = trackCount;
    this.noteToAdd = null;
  }

  addBar(beatCount: number, dibobinador: number, tempo: number) {
    this.bars.push(new Bar(this.trackCount, beatCount, dibobinador, tempo, this.bars.length));
  }

  addNote(barIndex: number, trackIndex: number, note: Note) {
    if (barIndex >= this.bars.length) throw new Error("Invalid bar index.");
    if (trackIndex >= this.trackCount) throw new Error("Invalid track index.");

    let leftoverNote = this.bars[barIndex].addNote(trackIndex, note);
    let currentBarIndex = barIndex;
    while (leftoverNote !== null) {
      currentBarIndex++;
      if (currentBarIndex >= this.bars.length) {
        const lastBar = this.bars[currentBarIndex - 1];
        this.addBar(lastBar.beatCount, lastBar.dibobinador, lastBar.tempo);
      }

      leftoverNote = this.bars[currentBarIndex].addNote(trackIndex, leftoverNote);
    }
  }
}

export const playSong = (sheet: Sheet, audioContext: AudioContext | null): void => {
  if (!audioContext) return;

  for (let i = 0; i < sheet.bars.length; i++) {
    const bar = sheet.bars[i];
    const baseStart = (bar.beatCount * i) / bar.timeRatio;
    bar.setNotesTimesInSeconds();

    const barNotes = bar.tracks.flat();
    for (let j = 0; j < barNotes.length; j++) {
      const note = barNotes[j];
      if (note.startInSeconds == undefined)
        throw new Error(`Invalid note: '${j}' on bar '${i}', undefined startInSeconds.`);
      if (note.durationInSeconds == undefined)
        throw new Error(`Invalid note: '${j}' on bar '${i}', undefined durationInSeconds.`);

      const oscillator = audioContext.createOscillator();
      const gainNode = createGainNode(audioContext);

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
      oscillator.frequency.value = note.pitch?.key ? PitchDictionary[note.pitch.key] : 0;
      oscillator.start();
    }
  }
};
