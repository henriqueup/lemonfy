import { produce } from "immer";

import { createSheet } from "@entities/sheet";
import { createSong, SongSchema, type Song } from "@entities/song";
import {
  handleStorableAction,
  useEditorStore,
} from "@/store/editor/editorStore";
import { produceUndoneableAction } from "@/utils/immer";
import { type Instrument } from "@/server/entities/instrument";

export const loadSong = (song: Song) =>
  useEditorStore.setState({ song, currentInstrumentIndex: 0 });

export const setSong = (name: string, artist: string) =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      let song = createSong(name, artist);

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

export const addInstrument = (instrument: Instrument) =>
  useEditorStore.setState(state =>
    produceUndoneableAction(state, draft => {
      if (draft.song === undefined) return;

      handleStorableAction(draft);

      const sheet = createSheet(instrument.trackCount);
      instrument.sheet = sheet;

      draft.song.instruments.push(instrument);
      draft.currentInstrumentIndex = draft.song.instruments.length - 1;
    }),
  );

export const setCurrentInstrumentIndex = (instrumentIndex: number) =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      draft.currentInstrumentIndex = instrumentIndex;
    }),
  );
