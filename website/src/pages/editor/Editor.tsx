import { type NextPage } from "next";
import { useState } from "react";

import { Plus } from "../../icons";
import { useEditorStore } from "@store/editor";
import { classNames } from "../../styles/utils";
import EditorMenu from "./EditorMenu";
import { addSong, loadSong } from "@store/editor/songActions";
import SongMenu from "src/pages/editor/SongMenu";
import { type Song as SongEntity } from "@entities/song";
import Song from "./Song";

const Editor: NextPage = () => {
  const song = useEditorStore(state => state.song);
  const [songMenuIsOpen, setSongMenuIsOpen] = useState(false);

  const handleLoadSong = (songFromStorage: SongEntity) => {
    loadSong(songFromStorage);
  };

  const handleAddSong = (name: string, artist: string) => {
    addSong(name, artist);
    setSongMenuIsOpen(false);
  };

  return (
    <div className="h-screen bg-stone-300 text-stone-600 dark:bg-stone-900 dark:text-stone-400">
      {song === undefined ? (
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
      <EditorMenu handleLoad={handleLoadSong} />
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
