import {
  decreaseSelectedNoteDuration,
  decreaseSelectedOctave,
  increaseSelectedNoteDuration,
  increaseSelectedOctave,
  setNoteToAdd,
  setSelectedNoteDuration,
  setSelectedOctave,
} from "@store/editor/noteToAddActions";
import { type NoteDurationName, NOTE_DURATIONS } from "@entities/note";
import type * as PitchModule from "@entities/pitch";
import type * as NoteModule from "@entities/note";
import { useEditorStore } from "@store/editor";

jest.mock<typeof PitchModule>("@entities/pitch", () => ({
  ...jest.requireActual("@entities/pitch"),
  createPitch: jest.fn(() => ({ name: "C", octave: 2, key: "C2" })),
}));
jest.mock<typeof NoteModule>("@entities/note", () => ({
  ...jest.requireActual("@entities/note"),
  createNote: jest.fn((duration: number, start: number, pitch?: PitchModule.Pitch | undefined) => ({
    duration,
    start,
    hasSustain: true,
    isSustain: false,
    pitch,
  })),
}));

describe("Selected Octave", () => {
  it("Sets the selected Octave", () => {
    setSelectedOctave(2);

    expect(useEditorStore.getState().selectedOctave).toBe(2);
  });

  it("Increases the selected Octave", () => {
    useEditorStore.setState(() => ({
      selectedOctave: 3,
    }));
    increaseSelectedOctave();

    expect(useEditorStore.getState().selectedOctave).toBe(4);
  });

  it("Decreases the selected Octave", () => {
    useEditorStore.setState(() => ({
      selectedOctave: 3,
    }));
    decreaseSelectedOctave();

    expect(useEditorStore.getState().selectedOctave).toBe(2);
  });
});

describe("Selected Note Duration", () => {
  it("Sets the selected Note Duration", () => {
    setSelectedNoteDuration("EIGHTH");

    expect(useEditorStore.getState().selectedNoteDuration).toBe<NoteDurationName>("EIGHTH");
  });

  it("Increases the selected Note Duration", () => {
    useEditorStore.setState(() => ({
      selectedNoteDuration: "HALF",
    }));
    increaseSelectedNoteDuration();

    expect(useEditorStore.getState().selectedNoteDuration).toBe<NoteDurationName>("WHOLE");
  });

  it("Decreases the selected Note Duration", () => {
    useEditorStore.setState(() => ({
      selectedNoteDuration: "HALF",
    }));
    decreaseSelectedNoteDuration();

    expect(useEditorStore.getState().selectedNoteDuration).toBe<NoteDurationName>("HALF_TRIPLET");
  });
});

describe("Note to add", () => {
  it("Sets the Note value", () => {
    setNoteToAdd(NOTE_DURATIONS["WHOLE"], "C", 2);

    const noteToAdd = useEditorStore.getState().noteToAdd;
    expect(noteToAdd).toBeTruthy();

    expect(noteToAdd?.duration).toBe(NOTE_DURATIONS["WHOLE"]);
    expect(noteToAdd?.start).toBe(-1);
    expect(noteToAdd?.hasSustain).toBe(true);
    expect(noteToAdd?.isSustain).toBe(false);

    const pitch = noteToAdd?.pitch;
    expect(pitch).toBeTruthy();
    expect(pitch?.key).toBe("C2");
    expect(pitch?.name).toBe("C");
    expect(pitch?.octave).toBe(2);
  });
});
