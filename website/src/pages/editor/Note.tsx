import { type FunctionComponent } from "react";
import { type Note as NoteEntity } from "../../server/entities/note";

interface Props {
  note: NoteEntity;
  width: number;
}

const Note: FunctionComponent<Props> = ({ note, width }) => {
  const getNoteClassName = (note: NoteEntity): string | undefined => {
    if ((!note.isSustain && !note.hasSustain) || (note.isSustain && note.hasSustain)) return;

    if (note.isSustain) return "w-1/2 flex justify-start";
    if (note.hasSustain) return "w-1/2 flex justify-end";
  };

  return (
    <div
      className="flex items-center justify-center rounded border border-solid border-gray-200"
      style={{ width: `${width * 100}%` }}
    >
      {note.isSustain ? (
        <div className="flex w-1/2 justify-start">
          <span>...</span>
        </div>
      ) : null}
      <div className={getNoteClassName(note)}>
        <span>{`${note.pitch?.name || ""}${note.pitch?.octave || ""}`}</span>
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
