import React, { DragEvent, FunctionComponent, useState } from "react";
import Bar from "../../entities/bar";
import Beat from "../../entities/beat";
import Note from "../../entities/note";

type BeatProps = {
  showDivider: boolean;
  beat: Beat;
};

const EditorBeat: FunctionComponent<BeatProps> = ({ showDivider, beat }) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log(JSON.parse(event.dataTransfer.getData("lemonfy/note")));
    setPreviewNote(JSON.parse(event.dataTransfer.getData("lemonfy/note")));
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
        >{`Preview of note: ${previewNote?.pitch?.name}`}</div>
      ) : null}
    </div>
  );
};

export default EditorBeat;
