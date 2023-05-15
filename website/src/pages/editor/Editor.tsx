import { type FunctionComponent, useState, useEffect } from "react";

import { Plus } from "src/icons";
import { classNames } from "src/styles/utils";
import { useEditorStore } from "@store/editor";
import { setSong, loadSong } from "@store/editor/songActions";
import { type Song as SongEntity } from "@entities/song";
import EditorMenu from "./EditorMenu";
import SongMenu from "./SongMenu";
import Song from "./Song";

export interface EditorProps {
  songToLoad?: SongEntity;
}

const Editor: FunctionComponent<EditorProps> = ({ songToLoad }) => {
  const [songMenuIsOpen, setSongMenuIsOpen] = useState(false);
  const loadedSong = useEditorStore(state => state.song);

  useEffect(() => {
    if (songToLoad === undefined) return;

    loadSong(songToLoad);
  }, [songToLoad]);

  const handleAddSong = (name: string, artist: string) => {
    setSong(name, artist);
    setSongMenuIsOpen(false);
  };

  return (
    <div className="h-screen bg-inherit text-inherit">
      {loadedSong === undefined ? (
        <div className="flex justify-center">
          <div
            role="button"
            aria-label="New Song"
            className={classNames(
              "mt-4 flex cursor-pointer content-center justify-center",
              "rounded-full border border-solid border-stone-600 p-4 dark:border-stone-400",
            )}
            onClick={() => setSongMenuIsOpen(true)}
          >
            <Plus />
          </div>
        </div>
      ) : (
        <Song />
      )}
      <EditorMenu />
      {songMenuIsOpen ? (
        <SongMenu
          onAdd={handleAddSong}
          onClose={() => setSongMenuIsOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default Editor;
