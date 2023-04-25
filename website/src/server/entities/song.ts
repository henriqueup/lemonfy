import { SheetSchema } from "@entities/sheet";
import { z } from "zod";

export const SongSchema = z.object({
  name: z.string().min(1),
  artist: z.string().min(1),
  sheets: z.array(SheetSchema),
});

export type Song = z.infer<typeof SongSchema>;

interface ISongModule {
  createSong: (name: string, artist: string) => Song;
}

const SongModule: ISongModule = {
  createSong: (name: string, artist: string) => {
    return {
      name,
      artist,
      sheets: [],
    };
  },
};

export default SongModule;
