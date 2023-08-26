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
      className="flex rounded border bg-inherit p-4"
    >
      <div className="relative flex h-[100px] w-full flex-col justify-evenly bg-inherit">
        {bar.tracks.map((track, j) => (
          <div className="flex gap-2 bg-inherit leading-none" key={j}>
            <span>{instrument.tuning[j]?.key}</span>
            <Track
              index={j}
              bar={bar}
              track={track}
              handleAddNote={note => handleAddNote(0, j, note)}
              displayByFret={displayByFret}
            />
          </div>
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
