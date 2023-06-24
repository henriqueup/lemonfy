import type { ISongRepository } from "@domains/repositories";
import SheetModule from "@entities/sheet";
import type { Song, SongInfo } from "@entities/song";

export interface ISongDomain {
  save: (song: Song) => Promise<string>;
  list: () => Promise<SongInfo[]>;
  get: (songId: string) => Promise<Song>;
  deleteMany: (songIds: string[]) => Promise<void>;
}

class SongDomain implements ISongDomain {
  private readonly SongRepository!: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.SongRepository = songRepository;
  }

  async save(song: Song) {
    if (song.id === undefined) {
      return this.SongRepository.create(song);
    }

    await this.SongRepository.update(song);
    return song.id;
  }

  list(): Promise<SongInfo[]> {
    return this.SongRepository.list();
  }

  async get(songId: string): Promise<Song> {
    const result = await this.SongRepository.get(songId);

    if (result === null) throw new Error(`No Song with id: ${songId}.`);

    result.sheets.forEach(sheet => SheetModule.fillBarsInSheet(sheet));
    return result;
  }

  deleteMany(songIds: string[]): Promise<void> {
    return this.SongRepository.deleteMany(songIds);
  }
}

export default SongDomain;
