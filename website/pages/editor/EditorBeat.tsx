import React, { DragEvent, FunctionComponent, useContext, useState } from "react";
import { DraggedNoteContext } from ".";
import Beat from "../../entities/beat";
import Note from "../../entities/note";

type BeatProps = {
  showDivider: boolean;
  beat: Beat;
};

const EditorBeat: FunctionComponent<BeatProps> = ({ showDivider, beat }) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const draggedNote = useContext(DraggedNoteContext);

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsShowingPreview(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsShowingPreview(false);
  };

  return (
    <div
      onDragEnter={event => handleDragEnter(event)}
      onDragLeave={event => handleDragLeave(event)}
      style={{
        width: "25%",
        borderRight: `${showDivider ? "1" : "0"}px solid lightgray`,
      }}
    >
      {isShowingPreview ? (
        <div
          style={{ border: "1px solid lightgray", borderRadius: "4px" }}
        >{`Preview of note: ${draggedNote?.pitch?.name}`}</div>
      ) : null}
    </div>
  );
};

export default EditorBeat;
