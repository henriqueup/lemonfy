import type { Song, SongInfo } from "@entities/song";

export interface ISongRepository {
  create: (song: Song) => Promise<void>;
  list: () => Promise<SongInfo[]>;
}
