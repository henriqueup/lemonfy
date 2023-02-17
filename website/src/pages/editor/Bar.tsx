import { type FunctionComponent } from "react";
import { type Bar as BarEntity } from "@entities/bar";
import { type Note } from "@entities/note";
import { addNoteFromDrop } from "@store/editor";
import Track from "./Track";

interface Props {
  bar: BarEntity;
}

const Bar: FunctionComponent<Props> = ({ bar }) => {
  const handleAddNote = (barIndex: number, trackIndex: number, note: Note) => {
    addNoteFromDrop(barIndex, trackIndex, note);
  };

  return (
    <div className="flex rounded border border-solid border-gray-200 p-4">
      <div className="flex flex-col justify-between">
        <div>
          <span>{`${bar.beatCount}/${bar.dibobinador}`}</span>
        </div>
        <div>
          <span>{bar.tempo}</span>
        </div>
      </div>
      <div className="flex h-[100px] w-full flex-col justify-evenly">
        {bar.tracks.map((track, j) => (
          <Track key={j} index={j} bar={bar} track={track} handleAddNote={note => handleAddNote(0, j, note)} />
        ))}
      </div>
    </div>
  );
};

export default Bar;
