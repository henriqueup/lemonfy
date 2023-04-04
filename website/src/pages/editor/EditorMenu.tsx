import { useState, type FunctionComponent, useEffect } from "react";
import { Button, ButtonContainer, CollapsableSideMenu } from "src/components";
import { type Sheet } from "@entities/sheet";
import { useEditorStore } from "@store/editor";
import { Moon, Sun } from "src/icons";

type Props = {
  handleLoad: (sheetFromStorage: Sheet) => void;
};

const EditorMenu: FunctionComponent<Props> = ({ handleLoad }) => {
  const currentSheet = useEditorStore(state => state.currentSheet);
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleClickDarkMode = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
      return;
    }

    setIsDarkMode(true);
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
  };

  const handleChangeIsOpen = (value: boolean) => setIsOpen(value);

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
    <CollapsableSideMenu isOpen={isOpen} onChangeIsOpen={handleChangeIsOpen} label="Editor Menu">
      <div className="flex h-full flex-col">
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
        <div className="flex h-full items-end justify-end">
          <ButtonContainer className="m-3" onClick={handleClickDarkMode}>
            {isDarkMode ? <Sun width={24} height={24} /> : <Moon width={24} height={24} />}
          </ButtonContainer>
        </div>
      </div>
    </CollapsableSideMenu>
  );
};

export default EditorMenu;
