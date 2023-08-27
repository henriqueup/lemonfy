import { type FunctionComponent, useState } from "react";

import { Plus } from "src/icons";
import { addBar } from "@/store/editor/sheetActions";
import { getCurrentInstrument, useEditorStore } from "@/store/editor";
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
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";

const SheetEditor: FunctionComponent = () => {
  const instrument = getCurrentInstrument();
  const bars = instrument?.sheet?.bars;
  const selectedOctave = useEditorStore(state => state.selectedOctave);
  const selectedDuration = useEditorStore(state => state.selectedNoteDuration);

  const [barMenuIsOpen, setBarMenuIsOpen] = useState(false);
  const [displayByFret, setDisplayByFret] = useState(true);

  if (instrument === undefined || bars === undefined) return null;

  const handleAddBar = (
    beatCount: number,
    dibobinador: number,
    tempo: number,
  ) => {
    addBar(beatCount, dibobinador, tempo);
    setBarMenuIsOpen(false);
  };

  return (
    <div className="h-full w-full rounded rounded-tl-none px-2">
      <PlaybackMenu />
      <div className="h-full rounded pr-1 pt-1">
        <div className="flex w-full items-center">
          <div className="flex w-1/2 items-center justify-start gap-3">
            {instrument.isFretted ? (
              <>
                <Switch
                  id="display-by-frets"
                  checked={displayByFret}
                  onCheckedChange={checked => setDisplayByFret(checked)}
                />
                <Label htmlFor="display-by-frets">Display by Frets</Label>
              </>
            ) : null}
          </div>
          <div className="flex w-1/2 justify-end gap-3">
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
        </div>
        <div className="mt-2 grid max-h-full grid-cols-2 gap-2 overflow-y-auto">
          {bars.map((bar, i) => (
            <Bar
              key={i}
              bar={bar}
              instrument={instrument}
              displayByFret={displayByFret}
            />
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
