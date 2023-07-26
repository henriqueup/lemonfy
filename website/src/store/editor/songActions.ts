import { produce } from "immer";

import SheetModule from "@entities/sheet";
import SongModule, { SongSchema, type Song } from "@entities/song";
import {
  handleStorableAction,
  useEditorStore,
} from "@/store/editor/editorStore";
import { produceUndoneableAction } from "@/utils/immer";

export const loadSong = (song: Song) =>
  useEditorStore.setState({ song, currentSheetIndex: 0 });

export const setSong = (name: string, artist: string) =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      let song = SongModule.createSong(name, artist);

      if (draft.song !== undefined) {
        song = {
          ...draft.song,
          name,
          artist,
        };
      }

      draft.song = song;
      handleStorableAction(draft);
    }),
  );

export const saveSong = (songId: string) =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      if (draft.song === undefined) return;

      draft.song = SongSchema.parse({ ...draft.song, id: songId });
      draft.isDirty = false;
    }),
  );

export const addSheet = (trackCount: number) =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      if (draft.song === undefined) return;

      const newSheet = SheetModule.createSheet(trackCount);

      handleStorableAction(draft);
      draft.song.sheets.push(newSheet);
      draft.currentSheetIndex = draft.song.sheets.length - 1;
    }),
  );
