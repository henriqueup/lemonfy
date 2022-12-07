import React, { DragEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { SheetContext } from ".";
import Bar from "../../entities/bar";
import Beat from "../../entities/beat";
import Note from "../../entities/note";

type BeatProps = {
  showDivider: boolean;
  beat: Beat;
  bar: Bar;
};

const EditorBeat: FunctionComponent<BeatProps> = ({ showDivider, beat, bar }) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);
  const [newNoteSize, setNewNoteSize] = useState<number | undefined>(undefined);
  const sheet = useContext(SheetContext);

  useEffect(() => {
    if (sheet.newNote !== null && bar.index !== undefined) {
      let size = sheet.newNote.duration * beat.dibobinador;
      let maxSize = 0 - beat.index;

      for (let i = bar.index; i < sheet.bars.length; i++) {
        const currentBar = sheet.bars[i];
        const currentBarSize = (currentBar.beatCount / currentBar.dibobinador) * currentBar.dibobinador;
        maxSize += currentBarSize;
      }

      if (size > maxSize) size = maxSize;

      setNewNoteSize(size);
    }
  }, [sheet, beat, bar]);

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
        width: `${(1 / bar.beatCount) * 100}%`,
        borderRight: `${showDivider ? "1" : "0"}px solid lightgray`,
      }}
    >
      {isShowingPreview ? (
        <div
          style={{ border: "1px solid lightgray", borderRadius: "4px", width: `${(newNoteSize || 0) * 100}%` }}
        >{`Preview of note: ${sheet.newNote?.pitch?.name}`}</div>
      ) : null}
    </div>
  );
};

export default EditorBeat;
