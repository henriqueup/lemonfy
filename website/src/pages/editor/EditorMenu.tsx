import { useState, type FunctionComponent } from "react";

import { Button, CollapsableSideMenu } from "src/components";
import { useEditorStore } from "@store/editor";
import { api } from "src/utils/api";
import { setSongId } from "@store/editor/songActions";

const EditorMenu: FunctionComponent = () => {
  const song = useEditorStore(state => state.song);
  const saveSongMutation = api.song.save.useMutation();
  const [isOpen, setIsOpen] = useState(false);

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
      </div>
    </CollapsableSideMenu>
  );
};

export default EditorMenu;
