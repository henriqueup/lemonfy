import { type FunctionComponent } from "react";

import { type Bar as BarEntity } from "@entities/bar";
import { type Note } from "@entities/note";
import { type Instrument } from "@entities/instrument";
// import { addNoteFromDrop } from "@/store/editor";
import Track from "./Track";
import { usePlayerStore } from "@/store/player";
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
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const isPaused = usePlayerStore(state => state.isPaused);
  const cursor = usePlayerStore(state => state.cursor);

  const handleAddNote = (barIndex: number, trackIndex: number, note: Note) => {
    // addNoteFromDrop(barIndex, trackIndex, note);
  };

  const handleRemoveBar = () => {
    removeBarFromSheetByIndex(bar.index);
  };

  return (
    <div
      role="group"
      aria-label={`Bar ${bar.index}`}
      className="flex rounded border p-4"
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
              handleAddNote={note => handleAddNote(0, j, note)}
              displayByFret={displayByFret}
            />
          ))}
          {isPlaying && cursor.barIndex === bar.index && (
            <Cursor
              bar={bar}
              isPlaying={isPlaying}
              isPaused={isPaused}
              position={cursor.position}
            />
          )}
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
