import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";

import { SECONDS_PER_MINUTE } from "src/utils/timeEvaluation";
import { convertDurationInBarToSeconds, type Bar } from "@entities/bar";

interface Props {
  bar: Bar;
  isPlaying: boolean;
  isPaused?: boolean;
  position: number;
}

const Cursor: FunctionComponent<Props> = ({
  bar,
  isPlaying,
  isPaused = false,
  position,
}) => {
  const [playbackAnimation, setPlaybackAnimation] = useState<Animation>();

  const cursorRef = useCallback(
    (divElement: HTMLDivElement | null) => {
      if (!isPlaying || isPaused || divElement === null) return;

      const totalBarDurationInSeconds = convertDurationInBarToSeconds(
        bar,
        bar.capacity,
      );
      const remainingBarDurationInSeconds = convertDurationInBarToSeconds(
        bar,
        bar.capacity - position,
      );
      const startPosition =
        totalBarDurationInSeconds - remainingBarDurationInSeconds;
      const startPositionPercentage =
        (startPosition / totalBarDurationInSeconds) * 100;

      const animation = divElement.animate(
        [{ left: `${startPositionPercentage}%` }, { left: "100%" }],
        {
          duration: remainingBarDurationInSeconds * 1000,
          easing: "linear",
        },
      );

      setPlaybackAnimation(animation);
    },
    [isPlaying, isPaused, bar, position],
  );

  useEffect(() => {
    if (isPaused) {
      playbackAnimation?.cancel();
    }
  }, [isPaused, playbackAnimation]);

  return (
    <div
      role="presentation"
      aria-label="Cursor"
      style={{
        left: `calc(${(position * 100) / bar.capacity}% - 4px)`,
        animation: isPlaying
          ? undefined
          : `blink ${SECONDS_PER_MINUTE / bar.tempo}s step-start infinite`,
      }}
      className="absolute top-[-2px] flex h-[calc(100%_+_4px)] w-[9px]"
      ref={cursorRef}
    >
      <div className="w-1/2 rounded-sm border-2 border-l-0 border-solid border-lemon" />
      <div className="w-1/2 rounded-sm border-2 border-r-0 border-solid border-lemon" />
    </div>
  );
};

export default Cursor;
