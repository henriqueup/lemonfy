import type { Sheet } from "@entities/sheet";
import type { Song } from "@entities/song";

export const getMockSong = (sheets?: Sheet[]): Song => {
  return {
    name: "Moonlight Sonata",
    artist: "Beethoven",
    sheets: sheets ?? [],
  };
};
