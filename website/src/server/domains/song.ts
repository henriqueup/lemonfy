import type { ISongRepository } from "@domains/repositories";
import type { Song } from "@entities/song";

export interface ISongDomain {
  create: (song: Song) => void;
}

class SongDomain implements ISongDomain {
  private readonly SongRepository!: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.SongRepository = songRepository;
  }

  create(song: Song) {
    this.SongRepository.create(song);
  }
}

export default SongDomain;
