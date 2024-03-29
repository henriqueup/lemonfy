/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEditorStore } from "@/store/editor";
import {
  getEmptyMockSheet,
  getMockSheetWithBars,
} from "src/mocks/entities/sheet";
import { INITIAL_STATE, usePlayerStore } from "@/store/player";
import { pause, play, stop, windUp } from "@/store/player/playerActions";
import { AudioNodeMock } from "@/mocks/window";
import { getMockSong } from "@/mocks/entities/song";

jest.useFakeTimers();
const setTimeoutSpy = jest.spyOn(global, "setTimeout");
const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
const referenceDate = new Date(2020, 3, 1);

// initial state must be restored because of the mock used for immer
const preservedInitialState = structuredClone(INITIAL_STATE);
beforeEach(() => {
  usePlayerStore.setState(structuredClone(preservedInitialState));

  jest.runAllTimers();
  setTimeoutSpy.mockClear();
  clearTimeoutSpy.mockClear();
});

jest.mock("@entities/bar");

describe("Play", () => {
  const mockAudioContext = new AudioContext();

  it("Does nothing with undefined Sheet", () => {
    play(mockAudioContext);

    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Does nothing with empty Sheet", () => {
    useEditorStore.setState({
      song: getMockSong([getEmptyMockSheet()]),
      currentInstrumentIndex: 0,
    });
    play(mockAudioContext);

    expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
  });

  it("Loads with audioNodes and editor cursor", () => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState({
      song: getMockSong([sheet]),
      currentInstrumentIndex: 0,
      cursor: { trackIndex: 0, barIndex: 2, position: 1 / 4 },
    });

    const dateAtStart = new Date(referenceDate);
    jest.setSystemTime(dateAtStart);
    play(mockAudioContext);

    expect(usePlayerStore.getState().cursor.barIndex).toBe(2);
    expect(usePlayerStore.getState().cursor.position).toBe(1 / 4);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toStrictEqual(
      dateAtStart,
    );
    expect(usePlayerStore.getState().audioNodes).toEqual([]);
  });

  it("Creates timeouts for each Bar", () => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState(() => ({
      song: getMockSong([sheet]),
      currentInstrumentIndex: 0,
    }));

    const dateAtStart = new Date(referenceDate);
    jest.setSystemTime(dateAtStart);
    play(mockAudioContext);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      sheet.bars[0]!.capacity * 1000,
    );
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().nextBarTimeout).not.toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(0);
    expect(usePlayerStore.getState().cursor.position).toBe(0);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toStrictEqual(
      dateAtStart,
    );

    dateAtStart.setMilliseconds(
      dateAtStart.getMilliseconds() + sheet.bars[0]!.capacity * 1000,
    );
    jest.runOnlyPendingTimers();

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      sheet.bars[1]!.capacity * 1000,
    );
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().nextBarTimeout).not.toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(1);
    expect(usePlayerStore.getState().cursor.position).toBe(0);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toStrictEqual(
      dateAtStart,
    );

    dateAtStart.setMilliseconds(
      dateAtStart.getMilliseconds() + sheet.bars[1]!.capacity * 1000,
    );
    jest.runOnlyPendingTimers();

    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      sheet.bars[2]!.capacity * 1000,
    );
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().nextBarTimeout).not.toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(2);
    expect(usePlayerStore.getState().cursor.position).toBe(0);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toStrictEqual(
      dateAtStart,
    );

    jest.runOnlyPendingTimers();

    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().nextBarTimeout).toBeUndefined();
    expect(usePlayerStore.getState().cursor.barIndex).toBe(0);
    expect(usePlayerStore.getState().cursor.position).toBe(0);
    expect(usePlayerStore.getState().currentTimeoutStartTime).toBeUndefined();
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

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isPlaying: true,
    });
  });

  it("Does nothing if already paused", () => {
    usePlayerStore.setState({
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
      isPaused: true,
    });

    pause();

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
      isPaused: true,
    });
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
      song: getMockSong([getEmptyMockSheet()]),
      currentInstrumentIndex: 0,
    });

    pause();

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
    });
  });

  it("Disconnects each audioNode", () => {
    const audioNodes = [new AudioNodeMock(), new AudioNodeMock()];
    usePlayerStore.setState({
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
      audioNodes,
    });
    useEditorStore.setState({
      song: getMockSong([getMockSheetWithBars()]),
      currentInstrumentIndex: 0,
    });

    pause();

    expect(audioNodes[0]!.disconnect).toHaveBeenCalledTimes(1);
    expect(audioNodes[1]!.disconnect).toHaveBeenCalledTimes(1);

    expect(usePlayerStore.getState().audioNodes).toHaveLength(0);
  });

  it("Sets state to paused", () => {
    usePlayerStore.setState(state => ({
      isPlaying: true,
      currentTimeoutStartTime: referenceDate,
      cursor: { ...state.cursor, barIndex: 1, position: 0.1 },
    }));
    useEditorStore.setState({
      song: getMockSong([getMockSheetWithBars()]),
      currentInstrumentIndex: 0,
    });

    const dateAtPause = new Date(referenceDate);
    dateAtPause.setMilliseconds(300);
    jest.setSystemTime(dateAtPause);
    pause();

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(useEditorStore.getState().cursor.barIndex).toBe(1);
    expect(useEditorStore.getState().cursor.position).toBe(0.1 + 0.3);
    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      isPlaying: true,
      isPaused: true,
      currentTimeoutStartTime: referenceDate,
      cursor: { ...INITIAL_STATE.cursor, barIndex: 1, position: 0.1 + 0.3 },
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

  it("Disconnects each audioNode", () => {
    const audioNodes = [new AudioNodeMock(), new AudioNodeMock()];
    usePlayerStore.setState({
      isPlaying: true,
      audioNodes,
    });

    stop();

    expect(audioNodes[0]!.disconnect).toHaveBeenCalledTimes(1);
    expect(audioNodes[1]!.disconnect).toHaveBeenCalledTimes(1);

    expect(usePlayerStore.getState().audioNodes).toHaveLength(0);
  });
});

describe("Wind up", () => {
  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])(
    "Does nothing with undefined Sheet, isRewind %p1, isFull %p2",
    (isRewind, isFull) => {
      windUp(isRewind, isFull);

      expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
    },
  );

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])(
    "Does nothing with invalid cursor, isRewind %p1, isFull %p2",
    (isRewind, isFull) => {
      useEditorStore.setState({
        song: getMockSong([getEmptyMockSheet()]),
        currentInstrumentIndex: 0,
      });
      windUp(isRewind, isFull);

      expect(usePlayerStore.getState()).toMatchObject(INITIAL_STATE);
    },
  );

  it("Winds up to start of next Bar while not playing", () => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState({
      song: getMockSong([sheet]),
      currentInstrumentIndex: 0,
      cursor: { trackIndex: 0, barIndex: 1, position: 1 / 4 },
    });

    windUp();

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      cursor: { barIndex: 2, position: 0 },
    });
    expect(useEditorStore.getState().cursor).toMatchObject({
      trackIndex: 0,
      barIndex: 2,
      position: 0,
    });
  });

  it("Winds up to start of next Bar while playing", () => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState({
      song: getMockSong([sheet]),
      currentInstrumentIndex: 0,
      cursor: { trackIndex: 0, barIndex: 0, position: 1 / 4 },
    });
    usePlayerStore.setState({
      isPlaying: true,
      cursor: { barIndex: 1, position: 1 / 2 },
    });

    windUp();

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      cursor: { barIndex: 2, position: 0 },
    });
    expect(useEditorStore.getState().cursor).toMatchObject({
      trackIndex: 0,
      barIndex: 2,
      position: 0,
    });
  });

  it.each([true, false])(
    "Winds up to start of last Bar, isPlaying %p",
    isPlaying => {
      const sheet = getMockSheetWithBars();
      useEditorStore.setState({
        song: getMockSong([sheet]),
        currentInstrumentIndex: 0,
        cursor: { trackIndex: 0, barIndex: 0, position: 1 / 4 },
      });
      usePlayerStore.setState({
        isPlaying,
        cursor: { barIndex: 1, position: 1 / 2 },
      });

      windUp(false, true);

      expect(usePlayerStore.getState()).toMatchObject({
        ...INITIAL_STATE,
        cursor: { barIndex: 2, position: 0 },
      });
      expect(useEditorStore.getState().cursor).toMatchObject({
        trackIndex: 0,
        barIndex: 2,
        position: 0,
      });
    },
  );

  it("Rewinds to start of previous Bar while not playing", () => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState({
      song: getMockSong([sheet]),
      currentInstrumentIndex: 0,
      cursor: { trackIndex: 0, barIndex: 1, position: 0 },
    });

    windUp(true);

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      cursor: { barIndex: 0, position: 0 },
    });
    expect(useEditorStore.getState().cursor).toMatchObject({
      trackIndex: 0,
      barIndex: 0,
      position: 0,
    });
  });

  it("Rewinds to start of current Bar while not playing", () => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState({
      song: getMockSong([sheet]),
      currentInstrumentIndex: 0,
      cursor: { trackIndex: 0, barIndex: 1, position: 1 / 4 },
    });

    windUp(true);

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      cursor: { barIndex: 1, position: 0 },
    });
    expect(useEditorStore.getState().cursor).toMatchObject({
      trackIndex: 0,
      barIndex: 1,
      position: 0,
    });
  });

  it("Rewinds to start of current Bar while playing", () => {
    const sheet = getMockSheetWithBars();
    useEditorStore.setState({
      song: getMockSong([sheet]),
      currentInstrumentIndex: 0,
      cursor: { trackIndex: 0, barIndex: 1, position: 1 / 4 },
    });
    usePlayerStore.setState({
      isPlaying: true,
      cursor: { barIndex: 2, position: 1 / 2 },
    });

    windUp(true);

    expect(usePlayerStore.getState()).toMatchObject({
      ...INITIAL_STATE,
      cursor: { barIndex: 2, position: 0 },
    });
    expect(useEditorStore.getState().cursor).toMatchObject({
      trackIndex: 0,
      barIndex: 2,
      position: 0,
    });
  });

  it.each([true, false])(
    "Rewinds to start of first Bar, isPlaying %p",
    isPlaying => {
      const sheet = getMockSheetWithBars();
      useEditorStore.setState({
        song: getMockSong([sheet]),
        currentInstrumentIndex: 0,
        cursor: { trackIndex: 0, barIndex: 0, position: 1 / 4 },
      });
      usePlayerStore.setState({
        isPlaying,
        cursor: { barIndex: 2, position: 1 / 2 },
      });

      windUp(true, true);

      expect(usePlayerStore.getState()).toMatchObject({
        ...INITIAL_STATE,
        cursor: { barIndex: 0, position: 0 },
      });
      expect(useEditorStore.getState().cursor).toMatchObject({
        trackIndex: 0,
        barIndex: 0,
        position: 0,
      });
    },
  );
});
