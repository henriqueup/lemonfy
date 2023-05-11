import { useState, type FunctionComponent, useEffect } from "react";

import { Button, ButtonContainer, CollapsableSideMenu } from "src/components";
import { useEditorStore } from "@store/editor";
import { Moon, Sun } from "src/icons";
import { api } from "src/utils/api";
import { setSongId } from "@store/editor/songActions";

const EditorMenu: FunctionComponent = () => {
  const song = useEditorStore(state => state.song);
  const saveSongMutation = api.song.save.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
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

  const handleSave = async () => {
    if (song === undefined) return;

    const songId = await saveSongMutation.mutateAsync(song);
    setSongId(songId);
  };

  return (
    <CollapsableSideMenu
      isOpen={isOpen}
      onChangeIsOpen={handleChangeIsOpen}
      label="Editor Menu"
    >
      <div className="flex h-full flex-col">
        <div className="mb-2 ml-auto mr-auto mt-2 flex w-full justify-center">
          <h3 className="m-auto">Editor Menu</h3>
        </div>
        <Button
          variant="primary"
          text="Save"
          disabled={song === undefined}
          onClick={() => void handleSave()}
          className="mt-6 w-2/5 self-center"
        />
        <div className="flex h-full items-end justify-end">
          <ButtonContainer className="m-3" onClick={handleClickDarkMode}>
            {isDarkMode ? (
              <Sun width={24} height={24} />
            ) : (
              <Moon width={24} height={24} />
            )}
          </ButtonContainer>
        </div>
      </div>
    </CollapsableSideMenu>
  );
};

export default EditorMenu;
