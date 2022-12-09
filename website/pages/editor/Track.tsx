import React, { CSSProperties, DragEvent, FunctionComponent, HTMLAttributes, useState } from "react";
import Bar from "../../entities/bar";
import Note from "../../entities/note";
import { useSheet } from "./SheetContext";

type TrackProps = {
  bar: Bar;
  track: Note[];
  handleAddNote: (note: Note) => void;
};

const Track: FunctionComponent<TrackProps> = ({ bar, track, handleAddNote }) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const { sheet } = useSheet();
  const barSize = bar.beatCount / bar.dibobinador;
  const remainingSizeInBar = barSize - Note.sumNotesDuration(track);
  let previewHasOverflow = false;
  console.log(sheet);

  const getNoteToAddSize = (note: Note | null) => {
    if (note === null || !isShowingPreview) return 0;

    let noteSize = note.duration;
    if (noteSize > remainingSizeInBar) {
      noteSize = remainingSizeInBar;
      previewHasOverflow = true;
    }

    return noteSize;
  };

  const getNoteSizePercentage = (noteSize: number) => `${(noteSize * 100) / barSize}%`;

  const noteToAddSize = getNoteToAddSize(sheet.noteToAdd);
  const noteToAddSizePercentage = getNoteSizePercentage(noteToAddSize);
  const remainingSizeInBarPercentage = getNoteSizePercentage(remainingSizeInBar - noteToAddSize);

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

  const getNoteStyle = (note: Note): CSSProperties | undefined => {
    if ((!note.isSustain && !note.hasSustain) || (note.isSustain && note.hasSustain)) return;

    if (note.isSustain) return { width: "50%", display: "flex", justifyContent: "flex-start" };
    if (note.hasSustain) return { width: "50%", display: "flex", justifyContent: "flex-end" };
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
        <div
          key={i}
          style={{
            border: "1px solid lightgray",
            borderRadius: "4px",
            width: getNoteSizePercentage(note.duration),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {note.isSustain ? (
            <div style={{ width: "50%", display: "flex", justifyContent: "flex-start" }}>
              <span>...</span>
            </div>
          ) : null}
          <div style={getNoteStyle(note)}>
            <span>{note.pitch?.name}</span>
          </div>
          {note.hasSustain ? (
            <div style={{ width: "50%", display: "flex", justifyContent: "flex-end" }}>
              <span>...</span>
            </div>
          ) : null}
        </div>
      ))}
      {isShowingPreview ? (
        <div
          style={{
            border: "1px solid lightgray",
            borderRadius: "4px",
            width: noteToAddSizePercentage,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: previewHasOverflow ? "50%" : "100%",
              display: "flex",
              justifyContent: previewHasOverflow ? "flex-end" : "center",
            }}
          >
            <span>{sheet.noteToAdd?.pitch?.name}</span>
          </div>
          {previewHasOverflow ? (
            <div style={{ width: "50%", display: "flex", justifyContent: "flex-end" }}>
              <span>...</span>
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        style={{
          width: remainingSizeInBarPercentage,
          margin: "auto 0px",
          height: "1px",
          border: "1px solid lightgray",
        }}
      />
    </div>
  );
};

export default Track;
