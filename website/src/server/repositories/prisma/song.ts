import type { Prisma, PrismaClient } from "@prisma/client";

import type { ISongRepository } from "@domains/repositories";
import type { Song } from "@entities/song";
import type { Sheet } from "@entities/sheet";

class SongPrismaRepository implements ISongRepository {
  readonly prisma!: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(song: Song) {
    console.log(`Create song '${song.name} - ${song.artist}' in prisma.`);

    await this.prisma.song.create({
      data: mapSongToCreateInput(song),
    });
  }
}

const mapSongToCreateInput = (song: Song): Prisma.SongCreateInput => {
  return {
    name: song.name,
    artist: song.artist,
    sheets: song.sheets.map(sheet => mapSheetToCreateInput(sheet)),
  };
};

const mapSheetToCreateInput = (
  sheet: Sheet,
): Prisma.SheetCreateWithoutSongInput => {
  return {
    trackCount: sheet.trackCount,
  };
};

export default SongPrismaRepository;
