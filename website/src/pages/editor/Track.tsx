import React, { type DragEvent, type FunctionComponent, useState } from "react";

import { type Bar } from "@entities/bar";
import { sumNotesDuration, type Note as NoteEntity } from "@entities/note";
import { TimeEvaluation } from "src/utils/timeEvaluation";
import { useEditorStore } from "@/store/editor";
import { cn } from "src/styles/utils";
import Cursor from "./Cursor";
import Note from "./Note";
import { usePlayerStore } from "@/store/player";

interface TrackProps {
  index: number;
  bar: Bar;
  track: NoteEntity[];
  handleAddNote: (note: NoteEntity) => void;
}

const Track: FunctionComponent<TrackProps> = ({
  index,
  bar,
  track,
  handleAddNote,
}) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const noteToAdd = useEditorStore(state => state.noteToAdd);
  const cursor = useEditorStore(state => state.cursor);
  const isPlaying = usePlayerStore(state => state.isPlaying);

  const isSelectedTrack = index === cursor.trackIndex;
  const isSelectedBar = bar.index === cursor.barIndex;
  const remainingSizeInBar = bar.capacity - sumNotesDuration(track);

  const getNoteToAddSize = () => {
    if (noteToAdd === null || !isShowingPreview) return 0;

    let noteSize = noteToAdd.duration;
    if (TimeEvaluation.IsGreaterThan(noteSize, remainingSizeInBar)) {
      noteSize = remainingSizeInBar;
      noteToAdd.hasSustain = true;
    }

    return noteSize;
  };

  const fitsAnotherNote = () => remainingSizeInBar > 0;

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!fitsAnotherNote()) return;

    setIsShowingPreview(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!fitsAnotherNote()) event.dataTransfer.dropEffect = "none";
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setIsShowingPreview(false);
  };

  const handleDrop = () => {
    setIsShowingPreview(false);
    if (noteToAdd === null || !fitsAnotherNote()) return;

    handleAddNote(noteToAdd);
  };

  return (
    <div
      onDragEnter={event => handleDragEnter(event)}
      onDragLeave={event => handleDragLeave(event)}
      onDragOver={event => handleDragOver(event)}
      onDrop={handleDrop}
      className="mb-0.5 mt-0.5 flex h-full w-full bg-inherit"
    >
      {/* <div className="flex p-2">
        <div
          className={cn(
            "rounded border-2 p-2",
            isSelectedTrack && "border-lime-600",
            isSelectedTrack && "bg-lime-400",
          )}
        />
      </div> */}
      <div className="relative flex w-full bg-inherit">
        {track.map((note, i) => (
          <Note key={i} note={note} barCapacity={bar.capacity} />
        ))}
        {isShowingPreview && noteToAdd !== null ? (
          <Note note={noteToAdd} barCapacity={bar.capacity} />
        ) : null}
        <div className="m-auto ml-0 mr-0 h-px flex-grow border" />
        {!isPlaying && isSelectedTrack && isSelectedBar ? (
          <Cursor bar={bar} isPlaying={isPlaying} position={cursor.position} />
        ) : null}
      </div>
    </div>
  );
};

export default Track;
