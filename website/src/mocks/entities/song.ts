import { getMockInstrument } from "@/mocks/entities/instrument";
import type { Sheet } from "@entities/sheet";
import type { Song } from "@entities/song";

export const getMockSong = (sheets?: Sheet[]): Song => {
  return {
    name: "Moonlight Sonata",
    artist: "Beethoven",
    instruments: sheets?.map(sheet => getMockInstrument(sheet)) ?? [],
  };
};
