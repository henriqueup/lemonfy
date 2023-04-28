import type { ISongRepository } from "@domains/repositories";
import SongDomain, { type ISongDomain } from "@domains/song";
import SongPrismaRepository from "@repositories/prisma/song";
import { prisma } from "../db";

export interface IDomainWrapper {
  readonly Song: ISongDomain;
}

class DomainWrapper implements IDomainWrapper {
  readonly Song!: ISongDomain;

  constructor(songRepository: ISongRepository) {
    this.Song = new SongDomain(songRepository);
  }
}

type PersistanceTypes = "prisma";

class DomainWrapperFactory {
  readonly persistanceType!: PersistanceTypes;

  constructor(persistanceType: PersistanceTypes) {
    this.persistanceType = persistanceType;
  }

  build(): IDomainWrapper {
    switch (this.persistanceType) {
      case "prisma":
        return new DomainWrapper(new SongPrismaRepository(prisma));

      default:
        throw new Error("Invalid persistance type.");
    }
  }
}

export default DomainWrapperFactory;
