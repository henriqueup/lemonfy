import type { Song, SongInfo } from "@entities/song";

export interface ISongRepository {
  create: (song: Song) => Promise<string>;
  list: () => Promise<SongInfo[]>;
  get: (songId: string) => Promise<Song | null>;
  update: (song: Song) => Promise<void>;
  deleteMany: (songIds: string[]) => Promise<void>;
}
