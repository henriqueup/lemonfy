import { type FunctionComponent, useState } from "react";
import { type Note } from "../../server/entities/note";
import { Plus } from "../../icons";
import Track from "./Track";
import BarMenu from "./BarMenu";
import NoteMenu from "./NoteMenu";
import { addBar, addNote, useEditorStore } from "../../store/editor";

const SheetEditor: FunctionComponent = () => {
  const currentSheet = useEditorStore(state => state.currentSheet);
  const [barMenuIsOpen, setBarMenuIsOpen] = useState(false);

  if (currentSheet === undefined) return null;

  const handleAddNote = (barIndex: number, trackIndex: number, note: Note) => {
    addNote(barIndex, trackIndex, note);
  };

  const handleAddBar = (beatCount: number, dibobinador: number, tempo: number) => {
    addBar(beatCount, dibobinador, tempo);
    setBarMenuIsOpen(false);
  };

  return (
    <>
      <div style={{ height: "60%", padding: "16px 16px 8px 16px" }}>
        <fieldset style={{ height: "100%", border: "1px solid lightgray", borderRadius: "4px" }}>
          <legend>Bars</legend>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              maxHeight: "100%",
              overflowY: "auto",
              columnGap: "8px",
              rowGap: "8px",
            }}
          >
            {currentSheet.bars.map((bar, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "16px",
                  border: "1px solid lightgray",
                  borderRadius: "4px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span>{`${bar.beatCount}/${bar.dibobinador}`}</span>
                  </div>
                  <div>
                    <span>{bar.tempo}</span>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }}
                >
                  {bar.tracks.map((track, j) => (
                    <Track
                      key={j}
                      index={j}
                      bar={bar}
                      track={track}
                      handleAddNote={note => handleAddNote(i, j, note)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginTop: "16px",
                padding: "4px",
                cursor: "pointer",
                border: "1px solid lightgray",
                borderRadius: "50%",
              }}
              onClick={() => setBarMenuIsOpen(true)}
            >
              <Plus fill="lightgray" />
            </div>
          </div>
        </fieldset>
      </div>
      <NoteMenu />
      {barMenuIsOpen ? <BarMenu onAdd={handleAddBar} onClose={() => setBarMenuIsOpen(false)} /> : null}
    </>
  );
};

export default SheetEditor;
