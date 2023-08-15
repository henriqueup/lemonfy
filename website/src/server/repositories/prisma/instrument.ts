import { Prisma, type PrismaClient } from "@prisma/client";

import type { IInstrumentRepository } from "@domains/repositories";
import {
  createInstrument,
  type InstrumentInfo,
  type Instrument,
  InstrumentInfoSchema,
  type InstrumentCreate,
  InstrumentSchema,
} from "@/server/entities/instrument";
import { type Pitch, createPitchFromKey } from "@entities/pitch";
import { BusinessException } from "@/utils/exceptions";

class InstrumentPrismaRepository implements IInstrumentRepository {
  readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(instrument: InstrumentCreate) {
    try {
      const result = await this.prisma.instrument.create({
        data: mapInstrumentToCreateInput(instrument),
      });

      return result.id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new BusinessException(
            `Instrument '${instrument.name}' already exists.`,
          );
        }
      }

      throw error;
    }
  }

  async update(instrument: Instrument): Promise<void> {
    const instrumentId = instrument.id;
    if (instrumentId === undefined)
      throw new Error("Instrument must have an id to be updated.");

    await this.prisma.instrumentTuning.deleteMany({
      where: { instrumentId },
    });

    await this.prisma.instrument.update({
      where: { id: instrumentId },
      data: mapInstrumentToCreateInput(instrument),
    });
  }

  async list(): Promise<InstrumentInfo[]> {
    const instruments = await this.prisma.instrument.findMany({
      include: instrumentIncludes,
      orderBy: { name: Prisma.SortOrder.asc },
    });

    return instruments.map(instrument =>
      InstrumentInfoSchema.parse(mapInstrumentModelToEntity(instrument)),
    );
  }

  async deleteMany(instrumentIds: string[]): Promise<void> {
    await this.prisma.instrument.deleteMany({
      where: { id: { in: instrumentIds } },
    });
  }
}

export const instrumentIncludes = Prisma.validator<Prisma.InstrumentInclude>()({
  InstrumentTuning: true,
});

type InstrumentModel = Prisma.InstrumentGetPayload<{
  include: typeof instrumentIncludes;
}>;

const mapInstrumentToCreateInput = (
  instrument: InstrumentCreate,
): Prisma.InstrumentCreateInput => {
  return {
    name: instrument.name,
    type: instrument.type,
    trackCount: instrument.trackCount,
    isFretted: instrument.isFretted,
    InstrumentTuning: mapInstrumentTuningToCreateInput(instrument.tuning),
  };
};

const mapInstrumentTuningToCreateInput = (pitches: Pitch[]) => {
  return {
    create: pitches.map(pitch => ({
      pitch: pitch.key,
    })),
  };
};

export const mapInstrumentModelToEntity = (
  model: InstrumentModel,
): Instrument => {
  return InstrumentSchema.parse(
    createInstrument(
      model.name,
      model.type,
      model.trackCount,
      model.InstrumentTuning.map(tuning => createPitchFromKey(tuning.pitch)),
      model.isFretted,
      model.id,
    ),
  );
};

export default InstrumentPrismaRepository;
