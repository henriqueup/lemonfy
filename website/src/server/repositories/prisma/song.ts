import { Prisma, type PrismaClient } from "@prisma/client";

import type { ISongRepository } from "@domains/repositories";
import {
  default as SongModule,
  type Song,
  type SongInfo,
} from "@entities/song";
import { default as SheetModule, type Sheet } from "@entities/sheet";
import { default as BarModule, type Bar } from "@entities/bar";
import { createNote, type Note } from "@entities/note";
import { createPitchFromKey } from "@entities/pitch";

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

  async list(): Promise<SongInfo[]> {
    const songs = await this.prisma.song.findMany();

    return songs.map(song => mapSongModelToInfoEntity(song));
  }
}

const songIncludes = Prisma.validator<Prisma.SongInclude>()({
  sheets: {
    include: {
      bars: true,
      notes: {
        orderBy: [
          {
            trackIndex: "asc",
          },
          {
            start: "asc",
          },
        ],
      },
    },
  },
});
const sheetIncludes = Prisma.validator<Prisma.SheetInclude>()({
  bars: true,
  notes: true,
});

type SongModel = Prisma.SongGetPayload<{ include: typeof songIncludes }>;
type SheetModel = Prisma.SheetGetPayload<{ include: typeof sheetIncludes }>;

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
      notes: mapNotesToCreateInput(sheet.tracks),
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

const mapNotesToCreateInput = (
  tracks: Note[][],
): Prisma.NoteCreateNestedManyWithoutSheetInput => {
  return {
    create: tracks.flatMap((track, i) =>
      track.map(note => ({
        trackIndex: i,
        duration: note.duration,
        start: note.start,
        pitch: note.pitch.key,
        isSustain: note.isSustain,
        hasSustain: note.hasSustain,
      })),
    ),
  };
};

const mapSongModelToInfoEntity = (
  model: Prisma.SongGetPayload<null>,
): SongInfo => {
  return SongModule.createSong(model.name, model.artist);
};

const mapSongModelToEntity = (model: SongModel): Song => {
  const song = SongModule.createSong(model.name, model.artist);
  song.sheets = model.sheets.map(sheet => mapSheetModelToEntity(sheet));

  return song;
};

const mapSheetModelToEntity = (model: SheetModel): Sheet => {
  const sheet = SheetModule.createSheet(model.trackCount);

  sheet.bars = model.bars.map(bar =>
    mapBarModelToEntity(model.trackCount, bar),
  );

  // we can push directly because of the order bys used
  model.notes.forEach(note => {
    sheet.tracks[note.trackIndex]?.push(mapNoteModelToEntity(note));
  });

  return sheet;
};

const mapBarModelToEntity = (
  trackCount: number,
  model: Prisma.BarGetPayload<null>,
): Bar => {
  const bar = BarModule.createBar(
    trackCount,
    model.beatCount,
    model.dibobinador,
    model.start,
    model.tempo,
    model.index,
  );

  return bar;
};

const mapNoteModelToEntity = (model: Prisma.NoteGetPayload<null>): Note => {
  const note = createNote(
    model.duration,
    model.start,
    createPitchFromKey(model.pitch),
    model.hasSustain,
    model.isSustain,
  );

  return note;
};

export default SongPrismaRepository;
