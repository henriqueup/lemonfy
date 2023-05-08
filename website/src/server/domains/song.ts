import type { ISongRepository } from "@domains/repositories";
import type { Song, SongInfo } from "@entities/song";

export interface ISongDomain {
  create: (song: Song) => Promise<void>;
  list: () => Promise<SongInfo[]>;
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
}

export default SongDomain;
