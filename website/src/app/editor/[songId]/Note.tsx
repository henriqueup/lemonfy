"use client";
import { type FunctionComponent } from "react";

import { type Note as NoteEntity } from "@entities/note";

interface Props {
  note: NoteEntity;
  barCapacity: number;
}

const Note: FunctionComponent<Props> = ({ note, barCapacity }) => {
  const getNoteClassName = (): string | undefined => {
    if (
      (!note.isSustain && !note.hasSustain) ||
      (note.isSustain && note.hasSustain)
    )
      return;

    if (note.isSustain) return "w-1/2 flex justify-start";
    if (note.hasSustain) return "w-1/2 flex justify-end";
  };

  return (
    <div
      className="absolute flex h-full items-center justify-center rounded border border-solid border-stone-600 bg-inherit dark:border-stone-400"
      style={{
        width: `${note.duration * barCapacity * 100}%`,
        left: `${(note.start * 100) / barCapacity}%`,
      }}
    >
      {note.isSustain ? (
        <div className="flex w-1/2 justify-start">
          <span>...</span>
        </div>
      ) : null}
      <div className={getNoteClassName()}>
        <span>{note.pitch.key}</span>
      </div>
      {note.hasSustain ? (
        <div className="flex w-1/2 justify-end">
          <span>...</span>
        </div>
      ) : null}
    </div>
  );
};

export default Note;
