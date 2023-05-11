import { type FunctionComponent } from "react";

import { type Bar as BarEntity } from "@entities/bar";
import { type Note } from "@entities/note";
// import { addNoteFromDrop } from "@store/editor";
import Track from "./Track";
import { usePlayerStore } from "@store/player";
import { Trash } from "src/icons";
import { removeBarFromSheetByIndex } from "@store/editor/sheetActions";
import { ButtonContainer } from "src/components";
import Cursor from "./Cursor";

interface Props {
  bar: BarEntity;
}

const Bar: FunctionComponent<Props> = ({ bar }) => {
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
    <div className="flex rounded border border-solid border-stone-600 bg-inherit p-4 dark:border-stone-400">
      <div className="relative flex h-[100px] w-full flex-col justify-evenly bg-inherit">
        {bar.tracks.map((track, j) => (
          <Track
            key={j}
            index={j}
            bar={bar}
            track={track}
            handleAddNote={note => handleAddNote(0, j, note)}
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
