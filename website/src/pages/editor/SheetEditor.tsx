import { type FunctionComponent, useState } from "react";

import { Plus } from "src/icons";
import { addBar } from "@/store/editor/sheetActions";
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import BarMenu from "./BarMenu";
import Bar from "./Bar";
import PlaybackMenu from "./PlaybackMenu";

const SheetEditor: FunctionComponent = () => {
  const bars = getCurrentSheet()?.bars;
  const selectedOctave = useEditorStore(state => state.selectedOctave);
  const selectedDuration = useEditorStore(state => state.selectedNoteDuration);
  const [barMenuIsOpen, setBarMenuIsOpen] = useState(false);

  if (bars === undefined) return null;

  const handleAddBar = (
    beatCount: number,
    dibobinador: number,
    tempo: number,
  ) => {
    addBar(beatCount, dibobinador, tempo);
    setBarMenuIsOpen(false);
  };

  // console.log(bars);
  return (
    <div className="relative h-full w-full bg-inherit">
      <PlaybackMenu />
      <div className="h-full bg-inherit p-4 pb-2 pt-0">
        <fieldset className="h-full rounded border bg-inherit p-1">
          <legend className="ml-3">Bars</legend>
          <div className="mt-2 flex w-full justify-end">
            <span className="pr-1">Octave: {selectedOctave}</span>
            <span className="pr-1">Note Duration: {selectedDuration}</span>
          </div>
          <div className="mt-2 grid max-h-full grid-cols-2 gap-2 overflow-y-auto bg-inherit">
            {bars.map((bar, i) => (
              <Bar key={i} bar={bar} />
            ))}
          </div>
          <div className="flex justify-center">
            <div
              role="button"
              aria-label="New Bar"
              className="mt-4 flex cursor-pointer content-center justify-center rounded-full border p-1"
              onClick={() => setBarMenuIsOpen(true)}
            >
              <Plus height={24} width={24} />
            </div>
          </div>
        </fieldset>
      </div>
      {barMenuIsOpen ? (
        <BarMenu onAdd={handleAddBar} onClose={() => setBarMenuIsOpen(false)} />
      ) : null}
    </div>
  );
};

export default SheetEditor;
