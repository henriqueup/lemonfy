import { z } from "zod";

import { InstrumentSchema } from "@/server/entities/instrument";

export const BaseSongSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1),
  artist: z.string().min(1),
});

export const SongInfoSchema = BaseSongSchema.merge(
  z.object({
    id: z.string().cuid(),
  }),
);

export const SongSchema = BaseSongSchema.merge(
  z.object({
    instruments: z.array(InstrumentSchema),
  }),
);

export type SongInfo = z.infer<typeof SongInfoSchema>;
export type Song = z.infer<typeof SongSchema>;

interface ISongModule {
  createSong: (name: string, artist: string, id?: string) => Song;
}

const SongModule: ISongModule = {
  createSong: (name: string, artist: string, id?: string) => {
    return SongSchema.parse({
      id,
      name,
      artist,
      instruments: [],
    });
  },
};

export default SongModule;
