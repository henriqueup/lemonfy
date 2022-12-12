import React, { CSSProperties, DragEvent, FunctionComponent, HTMLAttributes, useState } from "react";
import Bar from "../../entities/bar";
import NoteEntity from "../../entities/note";
import Note from "./Note";
import { useSheet } from "./SheetContext";

type TrackProps = {
  bar: Bar;
  track: NoteEntity[];
  handleAddNote: (note: NoteEntity) => void;
};

const Track: FunctionComponent<TrackProps> = ({ bar, track, handleAddNote }) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const { sheet } = useSheet();
  const barSize = bar.beatCount / bar.dibobinador;
  const remainingSizeInBar = barSize - NoteEntity.sumNotesDuration(track);
  console.log(sheet);

  const getNoteToAddSize = () => {
    if (sheet.noteToAdd === null || !isShowingPreview) return 0;

    let noteSize = sheet.noteToAdd.duration;
    if (noteSize > remainingSizeInBar) {
      noteSize = remainingSizeInBar;
      sheet.noteToAdd.hasSustain = true;
    }

    return noteSize;
  };

  const getNoteSizePercentage = (noteSize: number) => `${(noteSize * 100) / barSize}%`;

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsShowingPreview(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setIsShowingPreview(false);
  };

  const handleDrop = () => {
    setIsShowingPreview(false);
    if (sheet.noteToAdd === null) return;

    handleAddNote(sheet.noteToAdd);
  };

  return (
    <div
      onDragEnter={event => handleDragEnter(event)}
      onDragLeave={event => handleDragLeave(event)}
      onDragOver={event => event.preventDefault()}
      onDrop={handleDrop}
      style={{ width: "100%", height: "100%", display: "flex" }}
    >
      {track.map((note, i) => (
        <Note key={i} note={note} style={{ width: getNoteSizePercentage(note.duration) }} />
      ))}
      {isShowingPreview && sheet.noteToAdd !== null ? (
        <Note note={sheet.noteToAdd} style={{ width: getNoteSizePercentage(getNoteToAddSize()) }} />
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
