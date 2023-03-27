/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEditorStore } from "@store/editor";
import { getEmptyMockSheet, getMockSheetWithBars } from "src/mocks/entities/sheet";
import * as BarModule from "@entities/bar";
import * as MockUtilsModule from "src/mocks/utils/moduleUtils";
import { INITIAL_STATE, usePlayerStore } from "@store/player";
import { play, stop } from "@store/player/playerActions";

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

jest.mock<typeof BarModule>("@entities/bar", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>("src/mocks/utils/moduleUtils");
  return mockUtils.mockModuleFunctions(jest.requireActual("@entities/bar"));
});

describe("Play", () => {
  const barModuleWithMocks = MockUtilsModule.getModuleWithMocks(BarModule);

  it("Does nothing with undefined Sheet", () => {
    play();

    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with empty Sheet", () => {
    useEditorStore.setState(() => ({
      currentSheet: getEmptyMockSheet(),
    }));
    play();

    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Creates timeouts for each Bar", () => {
    barModuleWithMocks.convertDurationInBarToSeconds.mockImplementation((_, duration) => duration);
    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));

    play();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), sheet.bars[0]!.capacity * 1000);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().nextBarTimeout).not.toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(0);

    jest.runOnlyPendingTimers();

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), sheet.bars[1]!.capacity * 1000);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().nextBarTimeout).not.toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(1);

    jest.runOnlyPendingTimers();

    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), sheet.bars[2]!.capacity * 1000);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().nextBarTimeout).not.toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(2);

    jest.runOnlyPendingTimers();

    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().nextBarTimeout).toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(0);
  });
});

describe("Stop", () => {
  it("Resets state", () => {
    usePlayerStore.setState(() => ({
      isPlaying: true,
      currentBarIndex: 2,
    }));

    stop();

    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Clears timeout", () => {
    jest.spyOn(global, "clearTimeout");
    const timeout = setTimeout(() => console.log("never runs"), 8000);
    usePlayerStore.setState(() => ({
      isPlaying: true,
      currentBarIndex: 2,
      nextBarTimeout: timeout,
    }));

    stop();

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenLastCalledWith(timeout);
    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });
});
