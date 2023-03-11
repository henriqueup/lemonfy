import { type Bar, convertDurationInBarToSeconds } from "@entities/bar";
import { usePlayerStore } from "@store/player/playerStore";

const createNextBarTimeout = (barWithCursor: Bar | undefined): NodeJS.Timeout | undefined => {
  console.log("creating timeout", barWithCursor);
  if (barWithCursor === undefined) {
    stop();
    return undefined;
  }

  const barDurationInSeconds = convertDurationInBarToSeconds(barWithCursor, barWithCursor.capacity);

  return setTimeout(() => {
    usePlayerStore.setState(state => {
      const nextBarIndex = state.currentBarIndex + 1;
      const nextBar = state.sheet.bars[nextBarIndex];

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
    const barWithCursor = state.sheet.bars[state.currentBarIndex];
    console.log(state);
    const timeout = createNextBarTimeout(barWithCursor);

    return { isPlaying: true, nextBarTimeout: timeout };
  });

export const stop = () =>
  usePlayerStore.setState(state => {
    if (state.nextBarTimeout) clearTimeout(state.nextBarTimeout);

    console.log("stopping");
    return { isPlaying: false, nextBarTimeout: undefined, currentBarIndex: 0 };
  });
