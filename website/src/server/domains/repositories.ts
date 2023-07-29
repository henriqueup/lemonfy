import type { Instrument, InstrumentInfo } from "@/server/entities/instrument";
import type { Song, SongInfo } from "@entities/song";

export interface ISongRepository {
  create: (song: Song) => Promise<string>;
  list: () => Promise<SongInfo[]>;
  get: (songId: string) => Promise<Song | null>;
  update: (song: Song) => Promise<void>;
  deleteMany: (songIds: string[]) => Promise<void>;
}

export interface IInstrumentRepository {
  create: (instrument: Instrument) => Promise<string>;
  list: () => Promise<InstrumentInfo[]>;
  // TODO:
  // get: (instrumentId: string) => Promise<Instrument | null>;
  // update: (instrument: Instrument) => Promise<void>;
  // deleteMany: (instrumentIds: string[]) => Promise<void>;
}
