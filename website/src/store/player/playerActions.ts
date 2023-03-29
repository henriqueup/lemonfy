import { type Bar, convertDurationInBarToSeconds } from "@entities/bar";
import { useEditorStore } from "@store/editor";
import { INITIAL_STATE, usePlayerStore } from "@store/player";

const createNextBarTimeout = (barWithCursor: Bar | undefined, startPosition = 0): NodeJS.Timeout | undefined => {
  if (barWithCursor === undefined) {
    stop();
    return undefined;
  }

  const barDurationInSeconds = convertDurationInBarToSeconds(barWithCursor, barWithCursor.capacity - startPosition);

  return setTimeout(() => {
    usePlayerStore.setState(state => {
      const currentSheet = useEditorStore.getState().currentSheet;
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

export const play = (gainNodes: GainNode[], oscillatorNodes: OscillatorNode[]) => {
  usePlayerStore.setState(() => {
    const editorCursor = useEditorStore.getState().cursor;

    return {
      cursor: { barIndex: editorCursor.barIndex, position: editorCursor.position },
      gainNodes,
      oscillatorNodes,
    };
  });

  usePlayerStore.setState(state => {
    const currentSheet = useEditorStore.getState().currentSheet;
    if (currentSheet === undefined) return {};

    const barWithCursor = currentSheet.bars[state.cursor.barIndex];
    const startTime = new Date();

    const timeout = createNextBarTimeout(barWithCursor, state.cursor.position);
    if (timeout === undefined) return {};

    return { isPlaying: true, isPaused: false, currentTimeoutStartTime: startTime, nextBarTimeout: timeout };
  });
};

export const pause = () =>
  usePlayerStore.setState(state => {
    if (!state.isPlaying || state.currentTimeoutStartTime === undefined) return {};

    const currentSheet = useEditorStore.getState().currentSheet;
    if (currentSheet === undefined) return {};

    const barWithCursor = currentSheet.bars[state.cursor.barIndex];
    if (barWithCursor === undefined) return {};

    const timeElapsed = (new Date().getTime() - state.currentTimeoutStartTime.getTime()) / 1000;
    const totalBarTime = convertDurationInBarToSeconds(barWithCursor, barWithCursor.capacity);
    const currentBarPosition = barWithCursor.capacity * (timeElapsed / totalBarTime);

    state.gainNodes.forEach(gainNode => gainNode.disconnect());
    state.oscillatorNodes.forEach(oscillatorNode => oscillatorNode.disconnect());

    clearTimeout(state.nextBarTimeout);
    useEditorStore.setState(editorState => ({
      cursor: { ...editorState.cursor, barIndex: state.cursor.barIndex, position: currentBarPosition },
    }));

    return {
      isPaused: true,
      cursor: { ...state.cursor, position: currentBarPosition },
      gainNodes: [],
      oscillatorNodes: [],
    };
  });

export const stop = () =>
  usePlayerStore.setState(state => {
    if (state.nextBarTimeout) clearTimeout(state.nextBarTimeout);

    return { ...INITIAL_STATE, nextBarTimeout: undefined };
  });
