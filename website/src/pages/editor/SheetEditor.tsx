import { type FunctionComponent, useState } from "react";
import { Plus } from "src/icons";
import { addBar } from "@store/editor/sheetActions";
import { getCurrentSheet } from "@store/editor";
import BarMenu from "./BarMenu";
import NoteMenu from "./NoteMenu";
import Bar from "./Bar";
import PlaybackMenu from "./PlaybackMenu";

const SheetEditor: FunctionComponent = () => {
  const bars = getCurrentSheet()?.bars;
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
    <div className="h-full w-full bg-inherit">
      <PlaybackMenu />
      <div className="h-3/5 bg-inherit p-4 pb-2 pt-0 text-stone-600 dark:text-stone-400">
        <fieldset className="h-full rounded border border-solid border-stone-600 bg-inherit p-1 dark:border-stone-400">
          <legend className="ml-3">Bars</legend>
          <div className="mt-2 grid max-h-full grid-cols-2 gap-2 overflow-y-auto bg-inherit">
            {bars.map((bar, i) => (
              <Bar key={i} bar={bar} />
            ))}
          </div>
          <div className="flex justify-center">
            <div
              role="button"
              aria-label="New Bar"
              className="mt-4 flex cursor-pointer content-center justify-center rounded-full border border-solid border-stone-600 p-1 dark:border-stone-400"
              onClick={() => setBarMenuIsOpen(true)}
            >
              <Plus height={24} width={24} />
            </div>
          </div>
        </fieldset>
      </div>
      <NoteMenu />
      {barMenuIsOpen ? (
        <BarMenu onAdd={handleAddBar} onClose={() => setBarMenuIsOpen(false)} />
      ) : null}
    </div>
  );
};

export default SheetEditor;
