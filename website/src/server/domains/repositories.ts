import type { Song } from "@entities/song";

export interface ISongRepository {
  create: (song: Song) => Promise<void>;
}
