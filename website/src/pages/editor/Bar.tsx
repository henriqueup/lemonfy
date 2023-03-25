import { type FunctionComponent } from "react";
import { type Bar as BarEntity } from "@entities/bar";
import { type Note } from "@entities/note";
// import { addNoteFromDrop } from "@store/editor";
import Track from "./Track";
import { usePlayerStore } from "@store/player";
import Cursor from "src/pages/editor/Cursor";
import { Trash } from "src/icons";
import { removeBarFromSheetByIndex } from "@store/editor/sheetActions";
import { ButtonContainer } from "src/components";

interface Props {
  bar: BarEntity;
  index: number;
}

const Bar: FunctionComponent<Props> = ({ bar, index }) => {
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const playerBarIndex = usePlayerStore(state => state.currentBarIndex);

  const handleAddNote = (barIndex: number, trackIndex: number, note: Note) => {
    // addNoteFromDrop(barIndex, trackIndex, note);
  };

  const handleRemoveBar = () => {
    removeBarFromSheetByIndex(index);
  };

  return (
    <div className="flex rounded border border-solid border-gray-400 p-4">
      <div className="relative flex h-[100px] w-full flex-col justify-evenly">
        {bar.tracks.map((track, j) => (
          <Track key={j} index={j} bar={bar} track={track} handleAddNote={note => handleAddNote(0, j, note)} />
        ))}
        {isPlaying && playerBarIndex === bar.index && <Cursor bar={bar} isPlaying={isPlaying} />}
      </div>
      <div className="ml-4 mt-2 mb-2 flex flex-col items-center justify-between">
        <ButtonContainer onClick={handleRemoveBar}>
          <Trash stroke="lightgray" />
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
