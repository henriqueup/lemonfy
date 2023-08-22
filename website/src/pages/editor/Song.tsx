import { type FunctionComponent, useState } from "react";
import { Edit } from "lucide-react";

import { Plus } from "src/icons";
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import { cn } from "src/styles/utils";
import {
  addInstrument,
  setCurrentInstrumentIndex,
} from "@/store/editor/songActions";
import SheetEditor from "./SheetEditor";
import InstrumentMenu from "./InstrumentMenu";
import { type Instrument } from "@/server/entities/instrument";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

interface Props {
  openSongMenu: () => void;
}

const Song: FunctionComponent<Props> = ({ openSongMenu }: Props) => {
  const song = useEditorStore(state => state.song);
  const currentInstrumentIndex = useEditorStore(
    state => state.currentInstrumentIndex,
  );
  const currentSheet = getCurrentSheet();
  const [instrumentMenuIsOpen, setInstrumentMenuIsOpen] = useState(false);

  const handleAddInstrument = (instrument: Instrument) => {
    addInstrument(instrument);
    setInstrumentMenuIsOpen(false);
  };

  if (!song) return null;

  return (
    <div className="flex h-full flex-col gap-3 bg-inherit p-2 text-inherit">
      <div className="flex">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={openSongMenu}
        >
          <h1 className="flex">
            {`${song.name} - ${song.artist}`}{" "}
            <Edit size={16} className="ml-2 mt-1" />
          </h1>
        </div>
      </div>
      {currentSheet === undefined ? (
        <div className="flex justify-center">
          <div
            role="button"
            aria-label="Add Instrument"
            className={cn(
              "mt-4 flex cursor-pointer content-center justify-center",
              "rounded-full border p-4",
            )}
            onClick={() => setInstrumentMenuIsOpen(true)}
          >
            <Plus />
          </div>
        </div>
      ) : (
        <Tabs
          defaultValue={`${
            song.instruments[currentInstrumentIndex ?? 0]?.id ?? ""
          }-0`}
          className="flex h-full flex-col bg-inherit"
        >
          <TabsList className="z-10 w-min items-end justify-start rounded-b-none pb-0">
            {song.instruments.map((instrument, i) => (
              <TabsTrigger
                key={`${instrument.id}-${i}`}
                value={`${instrument.id}-${i}`}
                className="rounded-b-none"
                onClick={() => setCurrentInstrumentIndex(i)}
              >
                {instrument.name}
              </TabsTrigger>
            ))}
            <div
              className="ml-1 cursor-pointer p-2"
              onClick={() => setInstrumentMenuIsOpen(true)}
            >
              <Plus />
            </div>
          </TabsList>
          <div className="mt-[-4px] h-full rounded bg-muted p-1">
            {song.instruments.map((instrument, i) => (
              <TabsContent
                key={`${instrument.id}-${i}`}
                value={`${instrument.id}-${i}`}
                className="mt-0 h-full rounded bg-background"
              >
                <SheetEditor />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      )}
      {instrumentMenuIsOpen ? (
        <InstrumentMenu
          onAdd={handleAddInstrument}
          onClose={() => setInstrumentMenuIsOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default Song;
