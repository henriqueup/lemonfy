import React, { type DragEvent, type FunctionComponent, useState } from "react";
import { type Bar } from "../../server/entities/bar";
import { sumNotesDuration, type Note as NoteEntity } from "../../server/entities/note";
import { useEditorStore } from "../../store/editor";
import { classNames } from "../../styles/utils";
import Note from "./Note";

interface TrackProps {
  index: number;
  bar: Bar;
  track: NoteEntity[];
  handleAddNote: (note: NoteEntity) => void;
}

const Track: FunctionComponent<TrackProps> = ({ index, bar, track, handleAddNote }) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const noteToAdd = useEditorStore(state => state.noteToAdd);
  const selectedTrackIndex = useEditorStore(state => state.selectedTrackIndex);

  const isSelectedTrack = index === selectedTrackIndex;
  const barSize = bar.beatCount / bar.dibobinador;
  const remainingSizeInBar = barSize - sumNotesDuration(track);

  const getNoteToAddSize = () => {
    if (noteToAdd === null || !isShowingPreview) return 0;

    let noteSize = noteToAdd.duration;
    if (noteSize > remainingSizeInBar) {
      noteSize = remainingSizeInBar;
      noteToAdd.hasSustain = true;
    }

    return noteSize;
  };

  const getNoteWidth = (noteSize: number) => noteSize / barSize;

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
      className={classNames(
        "mt-0.5 mb-0.5 flex h-full w-full",
        isSelectedTrack ? "border-lime-600 text-lime-600" : "border-gray-200 text-gray-200",
      )}
    >
      <div className="flex border-inherit p-2 text-inherit">
        <div
          className={classNames("rounded border-2 border-solid border-inherit p-2", isSelectedTrack && "bg-lime-400")}
        />
      </div>
      <div className="flex w-full border-inherit">
        {track.map((note, i) => (
          <Note key={i} note={note} width={getNoteWidth(note.duration)} />
        ))}
        {isShowingPreview && noteToAdd !== null ? (
          <Note note={noteToAdd} width={getNoteWidth(getNoteToAddSize())} />
        ) : null}
        <div className="m-auto mr-0 ml-0 h-px flex-grow border border-solid border-inherit" />
      </div>
    </div>
  );
};

export default Track;
