import { useState, type FunctionComponent } from "react";
import { Button, CollapsableSideMenu } from "../../components";
import { type Sheet } from "@entities/sheet";
import { useEditorStore } from "@store/editor";
import { useAudioContext } from "src/hooks";
import { pause } from "@store/player/playerActions";
import { playSong } from "src/utils/audioContext";

type Props = {
  handleLoad: (sheetFromStorage: Sheet) => void;
};

const EditorMenu: FunctionComponent<Props> = ({ handleLoad }) => {
  const audioContext = useAudioContext();
  const currentSheet = useEditorStore(state => state.currentSheet);
  const cursor = useEditorStore(state => state.cursor);
  const [isOpen, setIsOpen] = useState(false);

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

  const handlePlay = () => {
    if (!audioContext) return;
    if (currentSheet === undefined) return;

    const barWithCursor = currentSheet.bars[cursor.barIndex];
    if (barWithCursor === undefined) throw new Error(`Invalid bar at ${cursor.barIndex}.`);

    playSong(currentSheet, audioContext, barWithCursor.start + cursor.position);
    setIsOpen(false);
  };

  const handlePause = () => {
    pause();
  };

  return (
    <CollapsableSideMenu isOpen={isOpen} onChangeIsOpen={handleChangeIsOpen} label="Editor Menu">
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
        <Button
          text="Play"
          variant="success"
          disabled={currentSheet === undefined}
          className="mt-6 w-2/5 self-center"
          onClick={handlePlay}
        />
        <Button
          text="Pause"
          disabled={currentSheet === undefined}
          className="mt-6 w-2/5 self-center"
          onClick={handlePause}
        />
      </div>
    </CollapsableSideMenu>
  );
};

export default EditorMenu;
