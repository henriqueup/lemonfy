import { SECONDS_PER_MINUTE } from "@entities/timeEvaluation";
import { useCallback, type FunctionComponent } from "react";
import { type Bar, convertDurationInBarToSeconds } from "@entities/bar";

interface Props {
  bar: Bar;
  isPlaying: boolean;
  position: number;
}

const Cursor: FunctionComponent<Props> = ({ bar, isPlaying, position }) => {
  const cursorRef = useCallback(
    (divElement: HTMLDivElement | null) => {
      if (!isPlaying || divElement === null) return;

      const totalBarDurationInSeconds = convertDurationInBarToSeconds(bar, bar.capacity);
      const remainingBarDurationInSeconds = convertDurationInBarToSeconds(bar, bar.capacity - position);
      const startPosition = totalBarDurationInSeconds - remainingBarDurationInSeconds;
      const startPositionPercentage = (startPosition / totalBarDurationInSeconds) * 100;

      divElement.animate([{ left: `${startPositionPercentage}%` }, { left: "100%" }], {
        duration: remainingBarDurationInSeconds * 1000,
        easing: "linear",
      });
    },
    [isPlaying, bar, position],
  );

  return (
    <div
      style={{
        left: `calc(${(position * 100) / bar.capacity}% - 4px)`,
        animation: isPlaying ? undefined : `blink ${SECONDS_PER_MINUTE / bar.tempo}s step-start infinite`,
      }}
      className="absolute top-[-2px] flex h-[calc(100%_+_4px)] w-[9px]"
      ref={cursorRef}
    >
      <div className="w-1/2 rounded-sm border-2 border-l-0 border-solid border-lime-600" />
      <div className="w-1/2 rounded-sm border-2 border-r-0 border-solid border-lime-600" />
    </div>
  );
};

export default Cursor;
