import { type FunctionComponent, useState } from "react";
import { Plus } from "../../icons";
import BarMenu from "./BarMenu";
import NoteMenu from "./NoteMenu";
import { useEditorStore } from "@store/editor";
import Bar from "./Bar";
import { addBar } from "@store/editor/sheetActions";

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
      <div className="h-3/5 p-4 pb-2 text-gray-400">
        <fieldset className="h-full rounded border border-solid border-gray-400 p-1">
          <legend className="ml-3">Bars</legend>
          <div className="grid max-h-full grid-cols-2 gap-2 overflow-y-auto">
            {bars.map((bar, i) => (
              <Bar key={i} bar={bar} />
            ))}
          </div>
          <div className="flex justify-center">
            <div
              className="mt-4 flex cursor-pointer content-center justify-center rounded-full border border-solid border-gray-400 p-1"
              onClick={() => setBarMenuIsOpen(true)}
            >
              <Plus height={24} width={24} stroke="lightgray" />
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
