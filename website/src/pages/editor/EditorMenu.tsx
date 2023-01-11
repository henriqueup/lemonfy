import { type FunctionComponent } from "react";
import { Button } from "../../components";
import { type Sheet } from "../../server/entities/sheet";
import { useSheet } from "./Editor";

type Props = {
  handleLoad: (sheetFromStorage: Sheet) => void;
};

const EditorMenu: FunctionComponent<Props> = ({ handleLoad }) => {
  const { sheet } = useSheet();

  const handleOwnLoad = () => {
    const storageSheetString = localStorage.getItem("sheet");
    if (storageSheetString === null) return;

    const sheetFromStorage = JSON.parse(storageSheetString) as Sheet;
    handleLoad(sheetFromStorage);
  };

  const handleSave = () => {
    localStorage.setItem("sheet", JSON.stringify(sheet));
  };

  return (
    <div className="absolute top-0 left-0 h-screen w-1/4 rounded border border-l-gray-200 bg-inherit">
      <div className="flex flex-col">
        <div className="mt-2 mb-2 ml-auto mr-auto flex w-full justify-center">
          <h3 className="m-auto">Editor Menu</h3>
        </div>
        <Button
          variant="primary"
          text="Save"
          disabled={sheet === undefined}
          onClick={handleSave}
          className="mt-6 w-2/5 self-center"
        />
        <Button text="Load" onClick={handleOwnLoad} className="mt-6 w-2/5 self-center" />
      </div>
    </div>
  );
};

export default EditorMenu;
