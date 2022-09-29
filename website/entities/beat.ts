import Note from "./note";

export default class Beat {
  index: number;
  dibobinador: number;
  notes: Note[];

  constructor(index: number, dibobinador: number, notes?: Note[]) {
    this.index = index;
    this.dibobinador = dibobinador;
    this.notes = [];

    if (notes != null) {
      this.fillBeat(notes);
    }
  }

  static sumNotesDuration(notes: Note[]) {
    return notes.reduce((currentDuration, currentNote) => currentDuration + currentNote.duration, 0);
  }

  fillBeat(notes: Note[]) {
    const notesDurationSum = Beat.sumNotesDuration(notes);

    if (notesDurationSum != 1 / this.dibobinador)
      throw new Error(
        `Invalid beat notes, expected total duration: '${1 / this.dibobinador}', actual: '${notesDurationSum}'`,
      );

    let currentStart = this.index * (1 / this.dibobinador);
    for (const note of notes) {
      note.start = currentStart;
      currentStart += note.duration;
    }

    this.notes.push(...notes);
  }

  addNote(note: Note) {
    const notesDurationSum = Beat.sumNotesDuration(this.notes.concat([note]));

    if (notesDurationSum > 1 / this.dibobinador)
      throw new Error("Invalid note, it would cause the beat's duration to overflow.");

    const isFirstNote = this.notes.length === 0;

    if (isFirstNote) {
      note.start = 0;
    } else {
      const previousNote = this.notes[this.notes.length - 1];

      if (previousNote.start == null) throw new Error("The previous note must have it's start set.");

      note.start = previousNote.start + previousNote.duration;
    }

    this.notes.push(note);
  }
}
