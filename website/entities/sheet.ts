import Bar from "./bar";
import Note from "./note";

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
      if (currentBarIndex >= this.bars.length) {
        const lastBar = this.bars[currentBarIndex - 1];
        this.addBar(lastBar.beatCount, lastBar.dibobinador, lastBar.tempo);
      }
      leftoverNote = this.bars[currentBarIndex].addNote(trackIndex, leftoverNote);
      currentBarIndex++;
    }
  }
}
