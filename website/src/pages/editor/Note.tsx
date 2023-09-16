import { type FunctionComponent } from "react";
import { type Note as NoteEntity } from "@entities/note";
import { type Bar } from "@entities/bar";

interface Props {
  note: NoteEntity;
  bar: Bar;
  fret?: number;
}

const Note: FunctionComponent<Props> = ({ note, bar, fret }) => {
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
      className="absolute flex h-full items-center justify-center rounded border bg-background"
      style={{
        width: `${((note.duration * bar.dibobinador) / bar.beatCount) * 100}%`,
        left: `${((note.start * bar.dibobinador) / bar.beatCount) * 100}%`,
      }}
    >
      {note.isSustain ? (
        <div className="flex w-1/2 justify-start">
          <span>...</span>
        </div>
      ) : null}
      <div className={getNoteClassName()}>
        <span>{fret !== undefined ? fret : note.pitch.key}</span>
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
