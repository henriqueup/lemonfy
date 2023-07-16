import { type FunctionComponent, useState } from "react";
import { Edit } from "lucide-react";

import { Plus } from "src/icons";
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import { cn } from "src/styles/utils";
import { addSheet } from "@/store/editor/songActions";
import SheetEditor from "./SheetEditor";
import SheetMenu from "./SheetMenu";

interface Props {
  openSongMenu: () => void;
}

const Song: FunctionComponent<Props> = ({ openSongMenu }: Props) => {
  const song = useEditorStore(state => state.song);
  const currentSheet = getCurrentSheet();
  const [sheetMenuIsOpen, setSheetMenuIsOpen] = useState(false);

  const handleAddSheet = (trackCount: number) => {
    addSheet(trackCount);
    setSheetMenuIsOpen(false);
  };

  if (!song) return null;

  return (
    <div className="h-full bg-inherit p-2 text-inherit">
      <fieldset className="h-full rounded border bg-inherit p-1">
        <legend className="ml-3">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={openSongMenu}
          >
            {`${song.name} - ${song.artist}`}{" "}
            <Edit size={16} className="mt-1" />
          </div>
        </legend>
        {currentSheet === undefined ? (
          <div className="flex justify-center">
            <div
              role="button"
              aria-label="New Sheet"
              className={cn(
                "mt-4 flex cursor-pointer content-center justify-center",
                "rounded-full border p-4",
              )}
              onClick={() => setSheetMenuIsOpen(true)}
            >
              <Plus />
            </div>
          </div>
        ) : (
          <SheetEditor />
        )}
        {sheetMenuIsOpen ? (
          <SheetMenu
            onAdd={handleAddSheet}
            onClose={() => setSheetMenuIsOpen(false)}
          />
        ) : null}
      </fieldset>
    </div>
  );
};

export default Song;
