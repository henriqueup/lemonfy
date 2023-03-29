/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEditorStore } from "@store/editor";
import { getEmptyMockSheet, getMockSheetWithBars } from "src/mocks/entities/sheet";
import * as BarModule from "@entities/bar";
import * as MockUtilsModule from "src/mocks/utils/moduleUtils";
import { INITIAL_STATE, usePlayerStore } from "@store/player";
import { pause, play, stop } from "@store/player/playerActions";
import { GainNodeMock, OscillatorNodeMock } from "@mocks/window";

jest.useFakeTimers();
const setTimeoutSpy = jest.spyOn(global, "setTimeout");
const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
const referenceDate = new Date(2020, 3, 1);

beforeEach(() => {
  jest.runAllTimers();
  setTimeoutSpy.mockClear();
  clearTimeoutSpy.mockClear();
});

jest.mock<typeof BarModule>("@entities/bar", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>("src/mocks/utils/moduleUtils");
  return mockUtils.mockModuleFunctions(jest.requireActual("@entities/bar"));
});
const barModuleWithMocks = MockUtilsModule.getModuleWithMocks(BarModule);

describe("Play", () => {
  it("Does nothing with undefined Sheet", () => {
    play([], []);

    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with empty Sheet", () => {
    useEditorStore.setState({
      currentSheet: getEmptyMockSheet(),
    });
    play([], []);

    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Loads with audioNodes and editor cursor", () => {
    const mockGainNodes = [new GainNodeMock()];
    const mockOscillatorNodes = [new OscillatorNodeMock()];

    const sheet = getMockSheetWithBars();
    useEditorStore.setState({
      currentSheet: sheet,
      cursor: { trackIndex: 0, barIndex: 2, position: 1 / 4 },
    });

    const dateAtStart = new Date(referenceDate);
    jest.setSystemTime(dateAtStart);
    play(mockGainNodes, mockOscillatorNodes);

    expect(usePlayerStore.getState().cursor.barIndex).toBe(2);
    expect(usePlayerStore.getState().cursor.position).toBe(1 / 4);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toStrictEqual(dateAtStart);
    expect(usePlayerStore.getState().gainNodes).toBe(mockGainNodes);
    expect(usePlayerStore.getState().oscillatorNodes).toBe(mockOscillatorNodes);
  });

  it("Creates timeouts for each Bar", () => {
    barModuleWithMocks.convertDurationInBarToSeconds.mockImplementation((_, duration) => duration);
    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      currentSheet: sheet,
    }));

    const dateAtStart = new Date(referenceDate);
    jest.setSystemTime(dateAtStart);
    play([], []);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), sheet.bars[0]!.capacity * 1000);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().nextBarTimeout).not.toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(0);
    expect(usePlayerStore.getState().cursor.position).toBe(0);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toStrictEqual(dateAtStart);

    dateAtStart.setMilliseconds(dateAtStart.getMilliseconds() + sheet.bars[0]!.capacity * 1000);
    jest.runOnlyPendingTimers();

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), sheet.bars[1]!.capacity * 1000);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().nextBarTimeout).not.toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(1);
    expect(usePlayerStore.getState().cursor.position).toBe(0);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toStrictEqual(dateAtStart);

    dateAtStart.setMilliseconds(dateAtStart.getMilliseconds() + sheet.bars[1]!.capacity * 1000);
    jest.runOnlyPendingTimers();

    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), sheet.bars[2]!.capacity * 1000);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().nextBarTimeout).not.toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(2);
    expect(usePlayerStore.getState().cursor.position).toBe(0);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toStrictEqual(dateAtStart);

    jest.runOnlyPendingTimers();

    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().nextBarTimeout).toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(0);
    expect(usePlayerStore.getState().cursor.position).toBe(0);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toStrictEqual(dateAtStart);
  });
});

describe("Pause", () => {
  it("Does nothing if not playing", () => {
    pause();

    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing if no timeout startTime", () => {
    usePlayerStore.setState({
      isPlaying: true,
    });

    pause();

    expect(usePlayerStore.getState()).toMatchObject({ ...INITIAL_STATE, isPlaying: true });
  });

  it("Does nothing with undefined sheet", () => {
    usePlayerStore.setState({
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
    });

    pause();

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
    });
  });

  it("Does nothing with empty sheet", () => {
    usePlayerStore.setState({
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
    });
    useEditorStore.setState({
      currentSheet: getEmptyMockSheet(),
    });

    pause();

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
    });
  });

  it("Disconnects each audioNode", () => {
    const gainNodes = [new GainNodeMock(), new GainNodeMock()];
    const oscillatorNodes = [new OscillatorNodeMock(), new OscillatorNodeMock(), new OscillatorNodeMock()];
    usePlayerStore.setState({
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
      gainNodes,
      oscillatorNodes,
    });
    useEditorStore.setState({
      currentSheet: getMockSheetWithBars(),
    });

    pause();

    expect(gainNodes[0]!.disconnect).toHaveBeenCalledTimes(1);
    expect(gainNodes[1]!.disconnect).toHaveBeenCalledTimes(1);

    expect(oscillatorNodes[0]!.disconnect).toHaveBeenCalledTimes(1);
    expect(oscillatorNodes[1]!.disconnect).toHaveBeenCalledTimes(1);
    expect(oscillatorNodes[2]!.disconnect).toHaveBeenCalledTimes(1);

    expect(usePlayerStore.getState().gainNodes).toHaveLength(0);
    expect(usePlayerStore.getState().oscillatorNodes).toHaveLength(0);
  });

  it("Sets state to paused", () => {
    barModuleWithMocks.convertDurationInBarToSeconds.mockImplementation((_, duration) => duration);
    usePlayerStore.setState(state => ({
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
      cursor: { ...state.cursor, barIndex: 1 },
    }));
    useEditorStore.setState({
      currentSheet: getMockSheetWithBars(),
    });

    const dateAtPause = new Date(referenceDate);
    dateAtPause.setMilliseconds(300);
    jest.setSystemTime(dateAtPause);
    pause();

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(useEditorStore.getState().cursor.barIndex).toBe(1);
    expect(useEditorStore.getState().cursor.position).toBe(0.3);
    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isPlaying: true,
      isPaused: true,
      currentTimeoutStartTime: referenceDate,
      cursor: { ...INITIAL_STATE.cursor, barIndex: 1, position: 0.3 },
    });
  });
});

describe("Stop", () => {
  it("Resets state", () => {
    usePlayerStore.setState(() => ({
      isPlaying: true,
      isPaused: true,
      currentBarIndex: 2,
    }));

    stop();

    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Clears timeout", () => {
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
