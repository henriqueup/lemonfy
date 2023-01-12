import { type NextPage } from "next";
import React, { createContext, useContext, useState } from "react";
import { Plus } from "../../icons";
import { createSheet, type Sheet } from "../../server/entities/sheet";
import { classNames } from "../../styles/utils";
import EditorMenu from "./EditorMenu";
import SheetEditor from "./SheetEditor";
import SheetMenu from "./SheetMenu";

const Editor: NextPage = () => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [currentSheet, setCurrentSheet] = useState<Sheet | undefined>();
  const [sheetMenuIsOpen, setSheetMenuIsOpen] = useState(false);

  const refreshCurrentSheet = () => {
    if (currentSheet === undefined) return;

    const newSheet = createSheet(currentSheet.trackCount);
    setCurrentSheet(Object.assign(newSheet, currentSheet));
  };

  const handleLoadSheet = (sheetFromStorage: Sheet) => {
    const newSheet = createSheet(sheetFromStorage.trackCount);
    setCurrentSheet(Object.assign(newSheet, sheetFromStorage));
  };

  const handleAddSheet = (trackCount: number) => {
    const newSheet = createSheet(trackCount);

    setSheets(sheets.concat([newSheet]));
    setCurrentSheet(newSheet);

    setSheetMenuIsOpen(false);
  };

  return (
    <div className="h-screen bg-black text-gray-200">
      <SheetContext.Provider value={{ sheet: currentSheet, refresh: refreshCurrentSheet }}>
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
      </SheetContext.Provider>
    </div>
  );
};

const SheetContext = createContext<{ sheet: Sheet | undefined; refresh: () => void }>({
  sheet: createSheet(1),
  refresh: () => {
    return;
  },
});

export const useSheet = () => {
  return useContext(SheetContext);
};

export default Editor;
