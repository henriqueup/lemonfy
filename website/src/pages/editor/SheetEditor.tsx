import { type FunctionComponent, useState } from "react";
import { Plus } from "../../icons";
import BarMenu from "./BarMenu";
import NoteMenu from "./NoteMenu";
import { addBar, useEditorStore } from "../../store/editor";
import Bar from "./Bar";

const SheetEditor: FunctionComponent = () => {
  const bars = useEditorStore(state => state.currentSheet?.bars);
  const [barMenuIsOpen, setBarMenuIsOpen] = useState(false);

  if (bars === undefined) return null;

  const handleAddBar = (beatCount: number, dibobinador: number, tempo: number) => {
    addBar(beatCount, dibobinador, tempo);
    setBarMenuIsOpen(false);
  };

  console.log(bars);
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
            {bars.map((bar, i) => (
              <Bar key={i} bar={bar} />
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
