import type { ISongRepository } from "@domains/repository";
import type { Song } from "@entities/song";
import SongRepository from "@repositories/song";

export interface ISongDomain {
  readonly SongRepository: ISongRepository;

  create: (song: Song) => void;
}

export class SongDomain implements ISongDomain {
  readonly SongRepository!: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.SongRepository = songRepository;
  }

  create(song: Song) {
    this.SongRepository.create(song);
  }
}

const songDomain = new SongDomain(SongRepository);
export default songDomain;
