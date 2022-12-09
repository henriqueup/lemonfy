import React, { DragEvent, FunctionComponent, useState } from "react";
import Bar from "../../entities/bar";
import Note from "../../entities/note";
import { useSheet } from "./SheetContext";

type TrackProps = {
  bar: Bar;
  track: Note[];
};

const Track: FunctionComponent<TrackProps> = ({ bar, track }) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const [newNoteSize, setNewNoteSize] = useState<number | undefined>(undefined);
  const { sheet } = useSheet();

  // useEffect(() => {
  //   if (sheet.noteToAdd !== null && bar.index !== undefined) {
  //     let size = sheet.noteToAdd.duration * beat.dibobinador;
  //     let maxSize = 0 - beat.index;

  //     for (let i = bar.index; i < sheet.bars.length; i++) {
  //       const currentBar = sheet.bars[i];
  //       const currentBarSize = (currentBar.beatCount / currentBar.dibobinador) * currentBar.dibobinador;
  //       maxSize += currentBarSize;
  //     }

  //     if (size > maxSize) size = maxSize;

  //     setNewNoteSize(size);
  //   }
  // }, [sheet, beat, bar]);

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsShowingPreview(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setIsShowingPreview(false);
  };

  return (
    <div
      onDragEnter={event => handleDragEnter(event)}
      onDragLeave={event => handleDragLeave(event)}
      style={{ width: "100%", height: "100%", display: "flex" }}
    >
      {isShowingPreview ? (
        <div style={{ border: "1px solid lightgray", borderRadius: "4px", width: "10%" }}>
          {sheet.noteToAdd?.pitch?.name}
        </div>
      ) : null}
      <div
        style={{
          width: isShowingPreview ? "90%" : "100%",
          margin: "auto 0px",
          height: "1px",
          border: "1px solid lightgray",
        }}
      />
    </div>
  );
};

export default Track;
