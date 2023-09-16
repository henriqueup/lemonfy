import type { ISongRepository } from "@domains/repositories";
import { fillBarsInSheet } from "@entities/sheet";
import type { Instrument } from "@entities/instrument";
import type { Song, SongInfo } from "@entities/song";
import { BusinessException } from "@/utils/exceptions";

export interface ISongDomain {
  save: (song: Song) => Promise<string>;
  list: () => Promise<SongInfo[]>;
  get: (songId: string) => Promise<Song>;
  deleteMany: (songIds: string[]) => Promise<void>;
}

class SongDomain implements ISongDomain {
  private readonly SongRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.SongRepository = songRepository;
  }

  async save(song: Song) {
    this.validateInstrumentsAlreadyExist(song.instruments);

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

    result.instruments.forEach(instrument => {
      if (instrument.sheet) fillBarsInSheet(instrument.sheet);
    });
    return result;
  }

  deleteMany(songIds: string[]): Promise<void> {
    return this.SongRepository.deleteMany(songIds);
  }

  private validateInstrumentsAlreadyExist(instruments: Instrument[]): void {
    const instrumentsWithoutId = instruments
      .filter(instrument => instrument.id === undefined)
      .map(instrument => instrument.name);

    if (instrumentsWithoutId.length) {
      throw new BusinessException(
        `All Instruments should already exist, but the following don't: ${instrumentsWithoutId.join(
          ", ",
        )}.`,
      );
    }
  }
}

export default SongDomain;
