import type { Instrument } from "@/server/entities/instrument";
import { NonSilentPitchSchema, createPitch } from "@/server/entities/pitch";
import type { Sheet } from "@/server/entities/sheet";

export const getMockInstrument = (sheet?: Sheet): Instrument => {
  return {
    id: "c13d226f-1932-40e2-9fd9-10198c219e33",
    name: "Mocked Instrument",
    type: "Percussion",
    trackCount: 8,
    isFretted: false,
    tuning: [
      NonSilentPitchSchema.parse(createPitch("X", 0)),
      NonSilentPitchSchema.parse(createPitch("X", 0)),
      NonSilentPitchSchema.parse(createPitch("X", 0)),
      NonSilentPitchSchema.parse(createPitch("X", 0)),
      NonSilentPitchSchema.parse(createPitch("X", 0)),
      NonSilentPitchSchema.parse(createPitch("X", 0)),
      NonSilentPitchSchema.parse(createPitch("X", 0)),
      NonSilentPitchSchema.parse(createPitch("X", 0)),
    ],
    sheet,
  };
};
