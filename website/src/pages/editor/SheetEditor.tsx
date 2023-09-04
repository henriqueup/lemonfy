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
      <div className="flex h-full flex-col rounded pr-1">
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
        <div className="flex flex-col overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pt-2 lg:grid-cols-3 2xl:grid-cols-4">
            {bars.map((bar, i) => (
              <div key={`bar-${i}`} className="relative">
                <span className="absolute -top-2 left-3 bg-background px-1 leading-none">{`${
                  i + 1
                }`}</span>
                <Bar
                  bar={bar}
                  instrument={instrument}
                  displayByFret={displayByFret}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center py-2">
            <div
              role="button"
              aria-label="New Bar"
              className="flex cursor-pointer content-center justify-center rounded-full border p-1"
              onClick={() => setBarMenuIsOpen(true)}
            >
              <Plus height={24} width={24} />
            </div>
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
