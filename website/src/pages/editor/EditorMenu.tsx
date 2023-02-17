import { type FunctionComponent } from "react";
import { Button, CollapsableSideMenu } from "../../components";
import { type Sheet } from "@entities/sheet";
import { useEditorStore } from "@store/editor";

type Props = {
  handleLoad: (sheetFromStorage: Sheet) => void;
};

const EditorMenu: FunctionComponent<Props> = ({ handleLoad }) => {
  const currentSheet = useEditorStore(state => state.currentSheet);

  const handleOwnLoad = () => {
    const storageSheetString = localStorage.getItem("sheet");
    if (storageSheetString === null) return;

    const sheetFromStorage = JSON.parse(storageSheetString) as Sheet;
    handleLoad(sheetFromStorage);
  };

  const handleSave = () => {
    localStorage.setItem("sheet", JSON.stringify(currentSheet));
  };

  return (
    <CollapsableSideMenu>
      <div className="flex flex-col">
        <div className="mt-2 mb-2 ml-auto mr-auto flex w-full justify-center">
          <h3 className="m-auto">Editor Menu</h3>
        </div>
        <Button
          variant="primary"
          text="Save"
          disabled={currentSheet === undefined}
          onClick={handleSave}
          className="mt-6 w-2/5 self-center"
        />
        <Button text="Load" onClick={handleOwnLoad} className="mt-6 w-2/5 self-center" />
      </div>
    </CollapsableSideMenu>
  );
};

export default EditorMenu;
