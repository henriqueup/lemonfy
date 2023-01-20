import React, { type DragEvent, type FunctionComponent, useState } from "react";
import { type Bar } from "../../server/entities/bar";
import { sumNotesDuration, type Note as NoteEntity } from "../../server/entities/note";
import { useEditorStore } from "../../store/editor";
import Note from "./Note";

type TrackProps = {
  bar: Bar;
  track: NoteEntity[];
  handleAddNote: (note: NoteEntity) => void;
};

const Track: FunctionComponent<TrackProps> = ({ bar, track, handleAddNote }) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const noteToAdd = useEditorStore(state => state.noteToAdd);

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

  const getNoteSizePercentage = (noteSize: number) => `${(noteSize * 100) / barSize}%`;

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
      style={{ width: "100%", height: "100%", display: "flex" }}
    >
      {track.map((note, i) => (
        <Note key={i} note={note} style={{ width: getNoteSizePercentage(note.duration) }} />
      ))}
      {isShowingPreview && noteToAdd !== null ? (
        <Note note={noteToAdd} style={{ width: getNoteSizePercentage(getNoteToAddSize()) }} />
      ) : null}
      <div
        style={{
          flexGrow: 1,
          margin: "auto 0px",
          height: "1px",
          border: "1px solid lightgray",
        }}
      />
    </div>
  );
};

export default Track;
