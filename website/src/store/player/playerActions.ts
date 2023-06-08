import { default as BarModule, type Bar } from "@entities/bar";
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import { INITIAL_STATE, usePlayerStore } from "@/store/player";

const createNextBarTimeout = (
  barWithCursor: Bar | undefined,
  startPosition = 0,
): NodeJS.Timeout | undefined => {
  if (barWithCursor === undefined) {
    stop();
    return undefined;
  }

  const barDurationInSeconds = BarModule.convertDurationInBarToSeconds(
    barWithCursor,
    barWithCursor.capacity - startPosition,
  );

  return setTimeout(() => {
    usePlayerStore.setState(state => {
      const currentSheet = getCurrentSheet();
      if (currentSheet === undefined) return {};

      const nextBarIndex = state.cursor.barIndex + 1;
      const nextBar = currentSheet.bars[nextBarIndex];

      const startTime = new Date();
      const timeout = createNextBarTimeout(nextBar);
      if (timeout === undefined) return {};

      return {
        currentTimeoutStartTime: startTime,
        cursor: {
          barIndex: nextBarIndex,
          position: 0,
        },
        nextBarTimeout: timeout,
      };
    });
  }, barDurationInSeconds * 1000);
};

export const play = (audioNodes: AudioNode[]) => {
  usePlayerStore.setState(state => {
    const currentSheet = getCurrentSheet();
    if (currentSheet === undefined || (state.isPlaying && !state.isPaused))
      return {};

    const editorCursor = useEditorStore.getState().cursor;
    const barWithCursor = currentSheet.bars[editorCursor.barIndex];
    const startTime = new Date();

    const timeout = createNextBarTimeout(barWithCursor, editorCursor.position);
    if (timeout === undefined) return {};

    return {
      isPlaying: true,
      isPaused: false,
      currentTimeoutStartTime: startTime,
      nextBarTimeout: timeout,
      cursor: {
        barIndex: editorCursor.barIndex,
        position: editorCursor.position,
      },
      audioNodes,
    };
  });
};

const clearAudioNodes = (audioNodes: AudioNode[]) => {
  audioNodes.forEach(audioNode => audioNode.disconnect());
};

export const pause = () =>
  usePlayerStore.setState(state => {
    if (
      !state.isPlaying ||
      state.currentTimeoutStartTime === undefined ||
      state.isPaused
    )
      return {};

    const currentSheet = getCurrentSheet();
    if (currentSheet === undefined) return {};

    const barWithCursor = currentSheet.bars[state.cursor.barIndex];
    if (barWithCursor === undefined) return {};

    const timeElapsed =
      (new Date().getTime() - state.currentTimeoutStartTime.getTime()) / 1000;
    const totalBarTime = BarModule.convertDurationInBarToSeconds(
      barWithCursor,
      barWithCursor.capacity,
    );
    const positionTraveled =
      barWithCursor.capacity * (timeElapsed / totalBarTime);
    const currentBarPosition = positionTraveled + state.cursor.position;

    clearAudioNodes(state.audioNodes);
    clearTimeout(state.nextBarTimeout);

    useEditorStore.setState(editorState => ({
      cursor: {
        ...editorState.cursor,
        barIndex: state.cursor.barIndex,
        position: currentBarPosition,
      },
    }));

    return {
      isPaused: true,
      cursor: { ...state.cursor, position: currentBarPosition },
      audioNodes: [],
    };
  });

export const stop = () =>
  usePlayerStore.setState(state => {
    clearAudioNodes(state.audioNodes);
    if (state.nextBarTimeout) clearTimeout(state.nextBarTimeout);

    return { ...INITIAL_STATE, nextBarTimeout: undefined };
  });

export const windUp = (isRewind = false, isFull = false) => {
  usePlayerStore.setState(state => {
    const currentSheet = getCurrentSheet();
    if (currentSheet === undefined) return {};

    const editorCursor = useEditorStore.getState().cursor;
    const currentBarIndex = state.isPlaying
      ? state.cursor.barIndex
      : editorCursor.barIndex;
    if (currentBarIndex >= currentSheet.bars.length) return {};

    stop();

    if (isRewind) {
      let nextBarIndex = isFull ? 0 : currentBarIndex;

      const cursorPosition = state.isPlaying
        ? state.cursor.position
        : editorCursor.position;
      if (cursorPosition === 0) nextBarIndex -= 1;

      nextBarIndex = Math.max(0, nextBarIndex);

      useEditorStore.setState(editorState => ({
        cursor: { ...editorState.cursor, barIndex: nextBarIndex, position: 0 },
      }));
      return { cursor: { barIndex: nextBarIndex, position: 0 } };
    }

    const lastBarIndex = currentSheet.bars.length - 1;
    let nextBarIndex = isFull ? lastBarIndex : currentBarIndex + 1;
    nextBarIndex = Math.min(lastBarIndex, nextBarIndex);

    useEditorStore.setState(editorState => ({
      cursor: { ...editorState.cursor, barIndex: nextBarIndex, position: 0 },
    }));
    return { cursor: { barIndex: nextBarIndex, position: 0 } };
  });
};
