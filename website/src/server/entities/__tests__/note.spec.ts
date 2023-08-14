import { createNote, NOTE_DURATIONS, sumNotesDuration } from "@entities/note";
import { createPitch, type Pitch } from "@entities/pitch";
import { toPrecision } from "src/utils/numbers";

describe("Create Note", () => {
  it("Creates Note with initial values", () => {
    const pitch = createPitch("C", 2);
    const newNote = createNote(NOTE_DURATIONS["HALF"], 2, pitch, true);

    expect(newNote.duration).toBe(NOTE_DURATIONS["HALF"]);
    expect(newNote.pitch).toMatchObject<Pitch>(pitch);
    expect(newNote.start).toBe(2);
    expect(newNote.hasSustain).toBe(true);
    expect(newNote.isSustain).toBe(false);

    expect(newNote.startInSeconds).toBeUndefined();
    expect(newNote.durationInSeconds).toBeUndefined();
  });
});

describe("Sum Note duration", () => {
  it("Sums empty Note array duration to 0", () => {
    const totalDuration = sumNotesDuration([]);

    expect(totalDuration).toBe(0);
  });

  it("Sums Note array duration", () => {
    const notes = [
      createNote(NOTE_DURATIONS["HALF"], 2, createPitch("C", 2), true),
      createNote(
        NOTE_DURATIONS["EIGHTH_TRIPLET"],
        2,
        createPitch("G#", 5),
        true,
        true,
      ),
      createNote(NOTE_DURATIONS["WHOLE"], 2, createPitch("F", 0)),
    ];

    const totalDuration = sumNotesDuration(notes);

    expect(totalDuration).toBe(
      toPrecision(
        NOTE_DURATIONS["HALF"] +
          NOTE_DURATIONS["EIGHTH_TRIPLET"] +
          NOTE_DURATIONS["WHOLE"],
      ),
    );
  });
});
