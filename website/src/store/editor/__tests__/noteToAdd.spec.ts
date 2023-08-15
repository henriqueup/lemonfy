import {
  decreaseSelectedNoteDuration,
  decreaseSelectedOctave,
  increaseSelectedNoteDuration,
  increaseSelectedOctave,
  setSelectedNoteDuration,
  setSelectedOctave,
} from "@/store/editor/noteToAddActions";
import {
  getHigherNoteDuration,
  getLowerNoteDuration,
  type NoteDurationName,
} from "@entities/note";
import { useEditorStore } from "@/store/editor";

jest.mock("@entities/note");

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

    expect(
      useEditorStore.getState().selectedNoteDuration,
    ).toBe<NoteDurationName>("EIGHTH");
  });

  it("Increases the selected Note Duration", () => {
    (getHigherNoteDuration as jest.Mock).mockImplementation(() => "WHOLE");
    useEditorStore.setState(() => ({
      selectedNoteDuration: "HALF",
    }));
    increaseSelectedNoteDuration();

    expect(
      useEditorStore.getState().selectedNoteDuration,
    ).toBe<NoteDurationName>("WHOLE");
  });

  it("Decreases the selected Note Duration", () => {
    (getLowerNoteDuration as jest.Mock).mockImplementation(
      () => "HALF_TRIPLET",
    );
    useEditorStore.setState(() => ({
      selectedNoteDuration: "HALF",
    }));
    decreaseSelectedNoteDuration();

    expect(
      useEditorStore.getState().selectedNoteDuration,
    ).toBe<NoteDurationName>("HALF_TRIPLET");
  });
});
