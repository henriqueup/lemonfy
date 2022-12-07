import Bar from "./bar";
import Note from "./note";

export default class Sheet {
  bars: Bar[];
  newNote: Note | null;

  constructor() {
    this.bars = [];
    this.newNote = null;
  }
}
