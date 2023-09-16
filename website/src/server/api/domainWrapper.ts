import type {
  IInstrumentRepository,
  ISongRepository,
} from "@domains/repositories";
import SongDomain, { type ISongDomain } from "@domains/song";
import SongPrismaRepository from "@repositories/prisma/song";
import { prisma } from "../db";
import InstrumentDomain, {
  type IInstrumentDomain,
} from "@/server/domains/instrument";
import InstrumentPrismaRepository from "@/server/repositories/prisma/instrument";

export interface IDomainWrapper {
  readonly Song: ISongDomain;
  readonly Instrument: IInstrumentDomain;
}

class DomainWrapper implements IDomainWrapper {
  readonly Song: ISongDomain;
  readonly Instrument: IInstrumentDomain;

  constructor(
    songRepository: ISongRepository,
    instrumentRepository: IInstrumentRepository,
  ) {
    this.Song = new SongDomain(songRepository);
    this.Instrument = new InstrumentDomain(instrumentRepository);
  }
}

class DomainWrapperFactory {
  create(): IDomainWrapper {
    return new DomainWrapper(
      new SongPrismaRepository(prisma),
      new InstrumentPrismaRepository(prisma),
    );
  }
}

export default DomainWrapperFactory;
