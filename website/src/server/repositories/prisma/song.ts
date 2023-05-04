import type { Prisma, PrismaClient } from "@prisma/client";

import type { ISongRepository } from "@domains/repositories";
import type { Song } from "@entities/song";
import type { Sheet } from "@entities/sheet";
import type { Bar } from "@entities/bar";
import type { Note } from "@entities/note";

class SongPrismaRepository implements ISongRepository {
  readonly prisma!: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(song: Song) {
    console.log(`Create song '${song.name} - ${song.artist}' in prisma.`);
    console.log(JSON.stringify(song));

    await this.prisma.song.create({
      data: mapSongToCreateInput(song),
    });
  }
}

const mapSongToCreateInput = (song: Song): Prisma.SongCreateInput => {
  return {
    name: song.name,
    artist: song.artist,
    sheets: mapSheetsToCreateInput(song.sheets),
  };
};

const mapSheetsToCreateInput = (
  sheets: Sheet[],
): Prisma.SheetCreateNestedManyWithoutSongInput => {
  return {
    create: sheets.map(sheet => ({
      trackCount: sheet.trackCount,
      bars: mapBarsToCreateInput(sheet.bars),
      tracks: mapTracksToCreateInput(sheet.tracks),
    })),
  };
};

const mapBarsToCreateInput = (
  bars: Bar[],
): Prisma.BarCreateNestedManyWithoutSheetInput => {
  return {
    create: bars.map(bar => ({
      beatCount: bar.beatCount,
      dibobinador: bar.dibobinador,
      tempo: bar.tempo,
      start: bar.start,
      capacity: bar.capacity,
      index: bar.index,
    })),
  };
};

const mapTracksToCreateInput = (
  tracks: Note[][],
): Prisma.TrackCreateNestedManyWithoutSheetInput => {
  return {
    create: tracks.map((track, i) => ({
      index: i,
      notes: mapNotesToCreateInput(track),
    })),
  };
};

const mapNotesToCreateInput = (
  notes: Note[],
): Prisma.NoteCreateNestedManyWithoutTrackInput => {
  return {
    create: notes.map(note => ({
      pitch: note.pitch?.key,
      start: note.start,
      duration: note.duration,
      hasSustain: note.hasSustain,
      isSustain: note.isSustain,
    })),
  };
};

export default SongPrismaRepository;
