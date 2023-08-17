import { type FunctionComponent, useState } from "react";

import { Plus } from "src/icons";
import { addBar } from "@/store/editor/sheetActions";
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import BarMenu from "./BarMenu";
import Bar from "./Bar";
import PlaybackMenu from "./PlaybackMenu";
import Incrementable from "@/components/Incrementable";
import {
  decreaseSelectedNoteDuration,
  decreaseSelectedOctave,
  increaseSelectedNoteDuration,
  increaseSelectedOctave,
} from "@/store/editor/noteToAddActions";

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
    <div className="h-full w-full rounded rounded-tl-none bg-inherit px-2">
      <PlaybackMenu />
      <div className="h-full rounded bg-inherit pr-1 pt-1">
        <div className="flex w-full justify-end gap-3">
          <Incrementable
            className="py-2"
            label="Octave"
            value={selectedOctave.toString()}
            onDecrement={decreaseSelectedOctave}
            onIncrement={increaseSelectedOctave}
            decrementButtonProps={{
              title: "⌘↓",
            }}
            incrementButtonProps={{
              title: "⌘↑",
            }}
          />
          <Incrementable
            className="py-2"
            label="Note Duration"
            value={selectedDuration}
            onDecrement={decreaseSelectedNoteDuration}
            onIncrement={increaseSelectedNoteDuration}
            decrementButtonProps={{
              title: "Alt↓",
            }}
            incrementButtonProps={{
              title: "Alt↑",
            }}
            valueProps={{
              title: selectedDuration,
              className:
                "max-w-[8rem] min-w-[8rem] overflow-x-clip text-ellipsis px-2",
            }}
          />
        </div>
        <div className="mt-2 grid max-h-full grid-cols-2 gap-2 overflow-y-auto bg-inherit">
          {bars.map((bar, i) => (
            <Bar key={i} bar={bar} />
          ))}
        </div>
        <div className="flex justify-center pb-2">
          <div
            role="button"
            aria-label="New Bar"
            className="mt-4 flex cursor-pointer content-center justify-center rounded-full border p-1"
            onClick={() => setBarMenuIsOpen(true)}
          >
            <Plus height={24} width={24} />
          </div>
        </div>
      </div>
      {barMenuIsOpen ? (
        <BarMenu onAdd={handleAddBar} onClose={() => setBarMenuIsOpen(false)} />
      ) : null}
    </div>
  );
};

export default SheetEditor;
