import { NextPage } from "next";
import { SheetProvider } from "./SheetContext";
import SheetEditor from "./SheetEditor";

const Editor: NextPage = () => {
  return (
    <SheetProvider>
      <SheetEditor />
    </SheetProvider>
  );
};

export default Editor;
