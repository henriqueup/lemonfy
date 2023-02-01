import { mockUseEditorStore } from "src/mocks/store/editor";
import {
  decreaseSelectedNoteDuration,
  decreaseSelectedOctave,
  increaseSelectedNoteDuration,
  increaseSelectedOctave,
  setSelectedNoteDuration,
  setSelectedOctave,
} from "@store/editor/noteToAddActions";
import { type NoteDurationName } from "@entities/note";

describe("Selected Octave", () => {
  it("Sets the selected Octave", () => {
    setSelectedOctave(2);

    expect(mockUseEditorStore.getState().selectedOctave).toBe(2);
  });

  it("Increases the selected Octave", () => {
    setSelectedOctave(3);
    increaseSelectedOctave();

    expect(mockUseEditorStore.getState().selectedOctave).toBe(4);
  });

  it("Decreases the selected Octave", () => {
    setSelectedOctave(3);
    decreaseSelectedOctave();

    expect(mockUseEditorStore.getState().selectedOctave).toBe(2);
  });
});

describe("Selected Note Duration", () => {
  it("Sets the selected Note Duration", () => {
    setSelectedNoteDuration("EIGHTH");

    expect(mockUseEditorStore.getState().selectedNoteDuration).toBe<NoteDurationName>("EIGHTH");
  });

  it("Increases the selected Note Duration", () => {
    setSelectedNoteDuration("HALF");
    increaseSelectedNoteDuration();

    expect(mockUseEditorStore.getState().selectedNoteDuration).toBe<NoteDurationName>("WHOLE");
  });

  it("Decreases the selected Note Duration", () => {
    setSelectedNoteDuration("HALF");
    decreaseSelectedNoteDuration();

    expect(mockUseEditorStore.getState().selectedNoteDuration).toBe<NoteDurationName>("HALF_TRIPLET");
  });
});
