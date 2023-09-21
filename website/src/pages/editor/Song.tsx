import { type FunctionComponent, useState, type MouseEvent } from "react";
import { Edit, X } from "lucide-react";

import { Plus } from "src/icons";
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import { cn } from "src/styles/utils";
import {
  addInstrument,
  removeInstrumentByIndex,
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

  const handleClickRemoveInstrument = (
    event: MouseEvent,
    instrumentIndex: number,
  ) => {
    event.stopPropagation();
    removeInstrumentByIndex(instrumentIndex);
  };

  if (!song) return null;

  return (
    <div className="flex h-full flex-col gap-3 p-2 text-inherit">
      <div className="flex h-6">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={openSongMenu}
        >
          <h1 className="flex text-xl">
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
            title="Add Instrument"
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
          value={`${song.instruments[currentInstrumentIndex ?? 0]?.id ?? ""}-${
            currentInstrumentIndex ?? 0
          }`}
          className="flex h-[calc(100%_-_36px)] flex-col"
        >
          <TabsList className="z-10 h-10 w-min max-w-full items-end justify-start overflow-x-auto rounded-b-none pb-0 pt-2">
            {song.instruments.map((instrument, i) => (
              <TabsTrigger
                key={`${instrument.id}-${i}`}
                value={`${instrument.id}-${i}`}
                className="flex items-center gap-2 rounded-b-none pr-2"
                onClick={() => setCurrentInstrumentIndex(i)}
              >
                {instrument.name}
                <X
                  className="mb-1 ml-1 h-3 w-3 rounded-full hover:bg-muted"
                  onClick={event => handleClickRemoveInstrument(event, i)}
                />
              </TabsTrigger>
            ))}
            <div
              className="ml-1 cursor-pointer p-2"
              onClick={() => setInstrumentMenuIsOpen(true)}
            >
              <Plus />
            </div>
          </TabsList>
          <div className="mt-[-4px] h-[calc(100%_-_40px)] rounded bg-muted p-1">
            {song.instruments.map((instrument, i) => (
              <TabsContent
                key={`${instrument.id}-${i}`}
                value={`${instrument.id}-${i}`}
                className="mt-0 h-full rounded rounded-tl-none bg-background"
              >
                <SheetEditor />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      )}
      {instrumentMenuIsOpen ? (
        <InstrumentMenu
          onSubmit={handleAddInstrument}
          onClose={() => setInstrumentMenuIsOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default Song;
