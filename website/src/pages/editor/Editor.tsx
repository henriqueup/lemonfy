import { type NextPage } from "next";
import { useState } from "react";
import { Plus } from "../../icons";
import { type Sheet } from "@entities/sheet";
import { useEditorStore } from "@store/editor";
import { classNames } from "../../styles/utils";
import EditorMenu from "./EditorMenu";
import SheetEditor from "./SheetEditor";
import SheetMenu from "./SheetMenu";
import { addSheet, loadSheet } from "@store/editor/sheetActions";

const Editor: NextPage = () => {
  const currentSheet = useEditorStore(state => state.currentSheet);
  const [sheetMenuIsOpen, setSheetMenuIsOpen] = useState(false);

  const handleLoadSheet = (sheetFromStorage: Sheet) => {
    loadSheet(sheetFromStorage);
  };

  const handleAddSheet = (trackCount: number) => {
    addSheet(trackCount);
    setSheetMenuIsOpen(false);
  };

  return (
    <div className="h-screen bg-stone-300 text-stone-600 dark:bg-stone-900 dark:text-stone-400">
      {currentSheet === undefined ? (
        <div className="flex justify-center">
          <div
            role="button"
            aria-label="New Sheet"
            className={classNames(
              "mt-4 flex cursor-pointer content-center justify-center",
              "rounded-full border border-solid border-stone-600 p-4 dark:border-stone-400",
            )}
            onClick={() => setSheetMenuIsOpen(true)}
          >
            <Plus />
          </div>
        </div>
      ) : (
        <SheetEditor />
      )}
      <EditorMenu handleLoad={handleLoadSheet} />
      {sheetMenuIsOpen ? <SheetMenu onAdd={handleAddSheet} onClose={() => setSheetMenuIsOpen(false)} /> : null}
    </div>
  );
};

export default Editor;
