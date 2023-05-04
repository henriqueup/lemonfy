import SheetModule from "@entities/sheet";
import SongModule, { type Song } from "@entities/song";
import { useEditorStore } from "@store/editor/editorStore";

export const loadSong = (song: Song) =>
  useEditorStore.setState({ song, currentSheetIndex: 0 });

export const setSong = (name: string, artist: string) =>
  useEditorStore.setState({ song: SongModule.createSong(name, artist) });

export const addSheet = (trackCount: number) =>
  useEditorStore.setState(state => {
    if (state.song === undefined) return {};

    const newSheet = SheetModule.createSheet(trackCount);

    return {
      song: { ...state.song, sheets: [...state.song.sheets, newSheet] },
      currentSheetIndex: state.song.sheets.length,
    };
  });
