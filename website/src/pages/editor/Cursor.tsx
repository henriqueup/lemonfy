import { SECONDS_PER_MINUTE } from "@entities/timeEvaluation";
import { type FunctionComponent } from "react";
import { type Bar, convertDurationInBarToSeconds } from "@entities/bar";

interface Props {
  bar: Bar;
  isPlaying: boolean;
  position?: number;
}

const Cursor: FunctionComponent<Props> = ({ bar, isPlaying, position }) => {
  return (
    <div
      style={{
        left: `calc(${((position || 0) * 100) / bar.capacity}% - 4px)`,
        animation: isPlaying
          ? `moveRight ${convertDurationInBarToSeconds(bar, bar.capacity)}s linear`
          : `blink ${SECONDS_PER_MINUTE / bar.tempo}s step-start infinite`,
      }}
      className="absolute top-[-2px] flex h-[calc(100%_+_4px)] w-[9px]"
    >
      <div className="w-1/2 rounded-sm border-2 border-l-0 border-solid border-lime-600" />
      <div className="w-1/2 rounded-sm border-2 border-r-0 border-solid border-lime-600" />
    </div>
  );
};

export default Cursor;
