import Note from "./note";

export default class Beat {
  index: number;
  notes: Note[];

  constructor(index: number);
  constructor(index: number, dibobinador: number, notes: Note[]);
  constructor(index: number, dibobinador?: number, notes?: Note[]) {
    this.index = index;
    this.notes = [];

    if (dibobinador != null && notes != null) {
      this.fillBeat(dibobinador, notes);
    }
  }

  fillBeat(dibobinador: number, notes: Note[]) {
    const notesDurationSum = notes.reduce((currentDuration, currentNote) => currentDuration + currentNote.duration, 0);

    if (notesDurationSum != 1 / dibobinador)
      throw new Error(
        `Invalid beat notes, expected total duration: '${1 / dibobinador}', actual: '${notesDurationSum}'`,
      );

    let currentStart = this.index * (1 / dibobinador);
    for (const note of notes) {
      note.start = currentStart;
      currentStart += note.duration;
    }

    this.notes.push(...notes);
  }
}
