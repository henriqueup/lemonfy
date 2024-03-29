import { type FunctionComponent, useState, useEffect } from "react";

import { Plus } from "src/icons";
import { cn } from "src/styles/utils";
import { reset as resetEditorStore, useEditorStore } from "@/store/editor";
import { reset as resetPlayerStore } from "@/store/player";
import { setSong, loadSong, addInstrument } from "@/store/editor/songActions";
import { type Song as SongEntity } from "@entities/song";
import SongMenu, { type SongForm } from "./SongMenu";
import Song from "./Song";
import UnsavedChangesDialog from "@/components/UnsavedChangesDialog";
import { setGlobalLoading } from "@/store/global/globalActions";

export interface EditorProps {
  songToLoad?: SongEntity;
}

const Editor: FunctionComponent<EditorProps> = ({ songToLoad }) => {
  const [songMenuIsOpen, setSongMenuIsOpen] = useState(false);
  const loadedSong = useEditorStore(state => state.song);
  const isDirty = useEditorStore(state => state.isDirty);

  useEffect(() => {
    return () => {
      resetEditorStore();
      resetPlayerStore();
    };
  }, []);

  useEffect(() => {
    if (songToLoad === undefined) return;

    loadSong(songToLoad);
    setGlobalLoading(false);
  }, [songToLoad]);

  const handleSaveSong = (songForm: SongForm) => {
    setSong(songForm.name, songForm.artist);

    if (songForm.instrument) {
      addInstrument(songForm.instrument);
    }

    setSongMenuIsOpen(false);
  };

  return (
    <>
      <div className="h-full text-inherit">
        {loadedSong === undefined ? (
          <div className="flex justify-center">
            <div
              role="button"
              aria-label="Add Song"
              title="Add Song"
              className={cn(
                "mt-4 flex cursor-pointer content-center justify-center",
                "rounded-full border border-lemon p-4",
              )}
              onClick={() => setSongMenuIsOpen(true)}
            >
              <Plus className="stroke-lemon" />
            </div>
          </div>
        ) : (
          <Song openSongMenu={() => setSongMenuIsOpen(true)} />
        )}
        {songMenuIsOpen ? (
          <SongMenu
            loadedSong={loadedSong}
            onSave={handleSaveSong}
            onClose={() => setSongMenuIsOpen(false)}
          />
        ) : null}
      </div>
      <UnsavedChangesDialog shouldConfirmLeave={isDirty} />
    </>
  );
};

export default Editor;
