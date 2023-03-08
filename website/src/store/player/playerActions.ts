import { type Bar, convertDurationInBarToSeconds } from "@entities/bar";
import { usePlayerStore } from "@store/player/playerStore";

const createNextBarTimeout = (barWithCursor: Bar): NodeJS.Timeout => {
  const barDurationInSeconds = convertDurationInBarToSeconds(barWithCursor, barWithCursor.capacity);

  return setTimeout(() => {
    usePlayerStore.setState(state => {
      const nextBarIndex = state.currentBarIndex + 1;
      const nextBar = state.sheet.bars[nextBarIndex];

      if (nextBar === undefined) {
        stop();
        return {};
      }

      const timeout = createNextBarTimeout(nextBar);

      return {
        currentBarIndex: nextBarIndex,
        nextBarTimeout: timeout,
      };
    });
  }, barDurationInSeconds * 1000);
};

export const play = () =>
  usePlayerStore.setState(state => {
    const barWithCursor = state.sheet.bars[state.currentBarIndex];
    if (barWithCursor === undefined) return {};

    const timeout = createNextBarTimeout(barWithCursor);

    return { isPlaying: true, nextBarTimeout: timeout };
  });

export const stop = () =>
  usePlayerStore.setState(state => {
    if (state.nextBarTimeout) clearTimeout(state.nextBarTimeout);

    return { isPlaying: false, nextBarTimeout: undefined, currentBarIndex: 0 };
  });
