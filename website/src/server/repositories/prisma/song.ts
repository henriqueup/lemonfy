import type { PrismaClient } from "@prisma/client";

import type { ISongRepository } from "@domains/repositories";
import type { Song } from "@entities/song";

class SongPrismaRepository implements ISongRepository {
  readonly prisma!: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create(song: Song) {
    console.log(`Save song '${song.name} - ${song.artist}' to prisma`);
  }
}

export default SongPrismaRepository;
