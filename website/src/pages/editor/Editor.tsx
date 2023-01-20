import { type NextPage } from "next";
import { useState } from "react";
import { Plus } from "../../icons";
import { type Sheet } from "../../server/entities/sheet";
import { addSheet, loadSheet, useEditorStore } from "../../store/editor";
import { classNames } from "../../styles/utils";
import EditorMenu from "./EditorMenu";
import SheetEditor from "./SheetEditor";
import SheetMenu from "./SheetMenu";

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
    <div className="h-screen bg-black text-gray-200">
      {currentSheet === undefined ? (
        <div className="flex justify-center">
          <div
            className={classNames(
              "mt-4 flex cursor-pointer content-center justify-center",
              "rounded-full border border-solid border-gray-200 p-4",
            )}
            onClick={() => setSheetMenuIsOpen(true)}
          >
            <Plus fill="lightgray" />
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
