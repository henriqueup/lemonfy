import { SheetSchema } from "@entities/sheet";
import { z } from "zod";

export const SongInfoSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1),
  artist: z.string().min(1),
});

export const SongSchema = SongInfoSchema.merge(
  z.object({
    sheets: z.array(SheetSchema),
  }),
);

export type SongInfo = z.infer<typeof SongInfoSchema>;
export type Song = z.infer<typeof SongSchema>;

interface ISongModule {
  createSong: (name: string, artist: string) => Song;
}

const SongModule: ISongModule = {
  createSong: (name: string, artist: string) => {
    return SongSchema.parse({
      name,
      artist,
      sheets: [],
    });
  },
};

export default SongModule;
