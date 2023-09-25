import { type FunctionComponent } from "react";
import { useRouter } from "next/router";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/Menubar";
import { useShortcuts, useToast } from "@/hooks";
import { useEditorStore } from "@/store/editor";
import { api } from "@/utils/api";
import { saveSong } from "@/store/editor/songActions";
import { setGlobalLoading } from "@/store/global/globalActions";

const FileMenu: FunctionComponent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const song = useEditorStore(state => state.song);

  const saveSongMutation = api.song.save.useMutation({
    useErrorBoundary: error =>
      !error.data?.isBusinessException && error.data?.httpStatus !== 504,
    onSettled: () => setGlobalLoading(false),
    onError: error => {
      if (error.data?.httpStatus === 504) {
        toast({
          variant: "destructive",
          title: "Connection error, please try again in a few minutes.",
        });
      } else if (error.data?.isBusinessException)
        toast({
          variant: "destructive",
          title: error.message,
        });
    },
    onSuccess: songId => {
      saveSong(songId);
      toast({
        variant: "success",
        title: "Song saved successfully.",
      });
    },
  });

  const handleSaveSong = () => {
    if (song === undefined) return;

    setGlobalLoading(true);
    saveSongMutation.mutate(song);
  };

  const handleNewSong = () => {
    void router.push("/editor");
  };

  useShortcuts({
    "new.song": {
      onKeyDown: handleNewSong,
    },
    "save.song": {
      onKeyDown: () => void handleSaveSong(),
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
