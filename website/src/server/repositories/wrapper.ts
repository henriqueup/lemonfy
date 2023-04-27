import type { ISongRepository } from "@domains/repository";
import SongRepository from "@repositories/song";

export interface IRepositoryWrapper {
  readonly Song: ISongRepository;
}

export class RepostoryWrapper implements IRepositoryWrapper {
  readonly Song!: ISongRepository;

  constructor(songRepository: ISongRepository) {
    return {
      Song: songRepository,
    };
  }
}

const repositoryWrapper = new RepostoryWrapper(SongRepository);
export default repositoryWrapper;
