import { type FunctionComponent } from "react";
import { useRouter } from "next/router";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/Menubar";
import { useShortcuts } from "@/hooks";
import { useEditorStore } from "@/store/editor";
import { api } from "@/utils/api";
import { setSongId } from "@/store/editor/songActions";

const FileMenu: FunctionComponent = () => {
  const router = useRouter();
  const song = useEditorStore(state => state.song);
  const saveSongMutation = api.song.save.useMutation();

  const handleSaveSong = async () => {
    if (song === undefined) return;

    const songId = await saveSongMutation.mutateAsync(song);
    setSongId(songId);
  };

  const handleNewSong = () => {
    void router.push("/editor");
  };

  useShortcuts({
    "new.song": {
      callback: handleNewSong,
    },
  });

  return (
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={handleNewSong}>
          New Song <MenubarShortcut>⌘⇧S</MenubarShortcut>
        </MenubarItem>
        <MenubarItem
          disabled={song === undefined}
          onClick={() => void handleSaveSong()}
        >
          Save Song <MenubarShortcut>⌘S</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

export default FileMenu;
