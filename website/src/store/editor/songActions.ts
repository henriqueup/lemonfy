import SheetModule from "@entities/sheet";
import SongModule, { SongSchema, type Song } from "@entities/song";
import {
  handleStorableAction,
  useEditorStore,
} from "@/store/editor/editorStore";

export const loadSong = (song: Song) =>
  useEditorStore.setState({ song, currentSheetIndex: 0 });

export const setSong = (name: string, artist: string) =>
  useEditorStore.setState(state => ({
    ...handleStorableAction(state),
    song: SongModule.createSong(name, artist),
  }));

export const saveSong = (songId: string) =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    return {
      song: SongSchema.parse({ ...state.song, id: songId }),
      isDirty: false,
    };
  });

export const addSheet = (trackCount: number) =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    const newSheet = SheetModule.createSheet(trackCount);

    return {
      ...handleStorableAction(state),
      song: { ...state.song, sheets: [...state.song.sheets, newSheet] },
      currentSheetIndex: state.song.sheets.length,
    };
  });
