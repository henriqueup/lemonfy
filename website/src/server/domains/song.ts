import type { ISongRepository } from "@domains/repositories";
import type { Song, SongInfo } from "@entities/song";

export interface ISongDomain {
  create: (song: Song) => Promise<void>;
  list: () => Promise<SongInfo[]>;
  get: (songId: string) => Promise<Song>;
}

class SongDomain implements ISongDomain {
  private readonly SongRepository!: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.SongRepository = songRepository;
  }

  async create(song: Song) {
    await this.SongRepository.create(song);
  }

  list(): Promise<SongInfo[]> {
    return this.SongRepository.list();
  }

  async get(songId: string): Promise<Song> {
    const result = await this.SongRepository.get(songId);

    if (result === null) throw new Error(`No Song with id: ${songId}.`);

    return result;
  }
}

export default SongDomain;
