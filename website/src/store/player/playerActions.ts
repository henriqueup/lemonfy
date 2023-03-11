import { type Bar, convertDurationInBarToSeconds } from "@entities/bar";
import { useEditorStore } from "@store/editor";
import { usePlayerStore } from "@store/player/playerStore";

const createNextBarTimeout = (barWithCursor: Bar | undefined): NodeJS.Timeout | undefined => {
  if (barWithCursor === undefined) {
    stop();
    return undefined;
  }

  const barDurationInSeconds = convertDurationInBarToSeconds(barWithCursor, barWithCursor.capacity);

  return setTimeout(() => {
    usePlayerStore.setState(state => {
      const currentSheet = useEditorStore.getState().currentSheet;
      if (currentSheet === undefined) return {};

      const nextBarIndex = state.currentBarIndex + 1;
      const nextBar = currentSheet.bars[nextBarIndex];

      const timeout = createNextBarTimeout(nextBar);
      if (timeout === undefined) return {};

      return {
        currentBarIndex: nextBarIndex,
        nextBarTimeout: timeout,
      };
    });
  }, barDurationInSeconds * 1000);
};

export const play = () =>
  usePlayerStore.setState(state => {
    const currentSheet = useEditorStore.getState().currentSheet;
    if (currentSheet === undefined) return {};

    const barWithCursor = currentSheet.bars[state.currentBarIndex];
    const timeout = createNextBarTimeout(barWithCursor);

    return { isPlaying: true, nextBarTimeout: timeout };
  });

export const stop = () =>
  usePlayerStore.setState(state => {
    if (state.nextBarTimeout) clearTimeout(state.nextBarTimeout);

    return { isPlaying: false, nextBarTimeout: undefined, currentBarIndex: 0 };
  });
