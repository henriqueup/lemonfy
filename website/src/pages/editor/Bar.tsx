import { useRef, type FunctionComponent, useMemo, useEffect } from "react";

import { type Bar as BarEntity } from "@entities/bar";
import { type Instrument } from "@entities/instrument";
import Track from "./Track";
import { usePlayerStore } from "@/store/player";
import { useEditorStore } from "@/store/editor";
import { Trash } from "src/icons";
import { removeBarFromSheetByIndex } from "@/store/editor/sheetActions";
import { ButtonContainer } from "src/components";
import Cursor from "./Cursor";

interface Props {
  bar: BarEntity;
  displayByFret?: boolean;
  instrument: Instrument;
}

const Bar: FunctionComponent<Props> = ({ bar, displayByFret, instrument }) => {
  const barRef = useRef<HTMLDivElement>(null);

  const isPlaying = usePlayerStore(state => state.isPlaying);
  const isPaused = usePlayerStore(state => state.isPaused);
  const playerCursor = usePlayerStore(state => state.cursor);
  const editorCursor = useEditorStore(state => state.cursor);

  const hasPlayerCursor = useMemo(
    () => isPlaying && playerCursor.barIndex === bar.index,
    [isPlaying, playerCursor.barIndex, bar.index],
  );
  const hasEditorCursor = useMemo(
    () => editorCursor.barIndex === bar.index,
    [editorCursor.barIndex, bar.index],
  );

  useEffect(() => {
    if (hasPlayerCursor || hasEditorCursor) {
      barRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [hasPlayerCursor, hasEditorCursor]);

  const handleRemoveBar = () => {
    removeBarFromSheetByIndex(bar.index);
  };

  return (
    <div
      role="group"
      aria-label={`Bar ${bar.index}`}
      className="flex rounded border p-4"
      ref={barRef}
    >
      <div className="flex w-full gap-2">
        <div className="flex h-[100px] flex-col justify-evenly">
          {bar.tracks.map((_, j) => (
            <span className="w-8 leading-none" key={j}>
              {instrument.tuning[j]?.key}
            </span>
          ))}
        </div>
        <div className="relative flex h-[100px] grow flex-col justify-evenly">
          {bar.tracks.map((track, j) => (
            <Track
              key={j}
              index={j}
              bar={bar}
              track={track}
              displayByFret={displayByFret}
            />
          ))}
          {hasPlayerCursor ? (
            <Cursor
              bar={bar}
              isPlaying={isPlaying}
              isPaused={isPaused}
              position={playerCursor.position}
            />
          ) : null}
        </div>
      </div>
      <div className="mb-2 ml-4 mt-2 flex flex-col items-center justify-between">
        <ButtonContainer onClick={handleRemoveBar}>
          <Trash />
        </ButtonContainer>
        <div>
          <span>{`${bar.beatCount}/${bar.dibobinador}`}</span>
        </div>
        <div>
          <span>{bar.tempo}</span>
        </div>
      </div>
    </div>
  );
};

export default Bar;
