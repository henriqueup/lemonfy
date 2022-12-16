import { NextPage } from "next";
import React, { createContext, useContext, useState } from "react";
import Sheet from "../../entities/sheet";
import { Plus } from "../../icons";
import SheetEditor from "./SheetEditor";
import SheetMenu from "./SheetMenu";

const Editor: NextPage = () => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [currentSheet, setCurrentSheet] = useState<Sheet | undefined>();
  const [sheetMenuIsOpen, setSheetMenuIsOpen] = useState(false);

  const refreshCurrentSheet = () => {
    if (currentSheet === undefined) return;

    setCurrentSheet({ ...currentSheet, addBar: currentSheet.addBar, addNote: currentSheet.addNote });
  };

  const handleAddSheet = (trackCount: number) => {
    const newSheet = new Sheet(trackCount);

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
          <SheetEditor />
        </SheetContext.Provider>
      )}
      {sheetMenuIsOpen ? <SheetMenu onAdd={handleAddSheet} /> : null}
    </div>
  );
};

const SheetContext = createContext<{ sheet: Sheet; refresh: () => void }>({
  sheet: new Sheet(1),
  refresh: () => {},
});

export const useSheet = () => {
  return useContext(SheetContext);
};

export default Editor;
