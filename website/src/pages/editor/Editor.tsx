import { type NextPage } from "next";
import React, { createContext, useContext, useState } from "react";
import { Plus } from "../../icons";
import { createSheet, type Sheet } from "../../server/entities/sheet";
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

  const handleLoadSheet = () => {
    const storageSheetString = localStorage.getItem("sheet");
    if (storageSheetString === null) return;

    const sheetFromStorage = JSON.parse(storageSheetString) as Sheet;
    const newSheet = createSheet(sheetFromStorage.trackCount);
    setCurrentSheet(Object.assign(newSheet, sheetFromStorage));
    // hmm, this breaks...
    // maybe it's time to finally abandon classes
  };

  const handleAddSheet = (trackCount: number) => {
    const newSheet = createSheet(trackCount);

    setSheets(sheets.concat([newSheet]));
    setCurrentSheet(newSheet);

    setSheetMenuIsOpen(false);
  };

  return (
    <div style={{ height: "100vh", background: "black", color: "lightgray" }}>
      {currentSheet === undefined ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginTop: "16px",
              padding: "4px",
              cursor: "pointer",
              border: "1px solid lightgray",
              borderRadius: "50%",
            }}
            onClick={() => setSheetMenuIsOpen(true)}
          >
            <Plus fill="lightgray" />
          </div>
        </div>
      ) : (
        <SheetContext.Provider value={{ sheet: currentSheet, refresh: refreshCurrentSheet }}>
          <SheetEditor handleLoad={handleLoadSheet} />
        </SheetContext.Provider>
      )}
      {sheetMenuIsOpen ? <SheetMenu onAdd={handleAddSheet} /> : null}
    </div>
  );
};

const SheetContext = createContext<{ sheet: Sheet; refresh: () => void }>({
  sheet: createSheet(1),
  refresh: () => {
    return;
  },
});

export const useSheet = () => {
  return useContext(SheetContext);
};

export default Editor;
