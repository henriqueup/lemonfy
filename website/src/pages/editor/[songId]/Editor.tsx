import { type FunctionComponent, useState, useEffect } from "react";

import { Plus } from "src/icons";
import { classNames } from "src/styles/utils";
import { setSong, loadSong } from "@store/editor/songActions";
import { type Song as SongEntity } from "@entities/song";
import EditorMenu from "./EditorMenu";
import SongMenu from "./SongMenu";
import Song from "./Song";

export interface EditorProps {
  song?: SongEntity;
}

const Editor: FunctionComponent<EditorProps> = ({ song }) => {
  const [songMenuIsOpen, setSongMenuIsOpen] = useState(false);

  useEffect(() => {
    if (song === undefined) return;

    loadSong(song);
  }, [song]);

  const handleAddSong = (name: string, artist: string) => {
    setSong(name, artist);
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
