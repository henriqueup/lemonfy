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

export const play = () => {
  usePlayerStore.setState(() => {
    const editorCursor = useEditorStore.getState().cursor;

    return { cursor: { barIndex: editorCursor.barIndex, position: editorCursor.position } };
  });

  usePlayerStore.setState(state => {
    const currentSheet = useEditorStore.getState().currentSheet;
    if (currentSheet === undefined) return {};

    const barWithCursor = currentSheet.bars[state.cursor.barIndex];
    const startTime = new Date();

    const timeout = createNextBarTimeout(barWithCursor, state.cursor.position);
    if (timeout === undefined) return {};

    return { isPlaying: true, currentTimeoutStartTime: startTime, nextBarTimeout: timeout };
  });
};

export const stop = () =>
  usePlayerStore.setState(state => {
    if (state.nextBarTimeout) clearTimeout(state.nextBarTimeout);

    return { ...INITIAL_STATE, nextBarTimeout: undefined };
  });
