import { CSSProperties, FunctionComponent } from "react";
import NoteEntity from "../../entities/note";

type NoteProps = {
  note: NoteEntity;
  style?: CSSProperties;
};

const Note: FunctionComponent<NoteProps> = ({ note, style }) => {
  const getNoteStyle = (note: NoteEntity): CSSProperties | undefined => {
    if ((!note.isSustain && !note.hasSustain) || (note.isSustain && note.hasSustain)) return;

    if (note.isSustain) return { width: "50%", display: "flex", justifyContent: "flex-start" };
    if (note.hasSustain) return { width: "50%", display: "flex", justifyContent: "flex-end" };
  };

  return (
    <div
      style={{
        border: "1px solid lightgray",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
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
  );
};

export default Note;
