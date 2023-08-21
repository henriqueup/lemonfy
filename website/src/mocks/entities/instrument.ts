import type { Instrument } from "@/server/entities/instrument";
import * as PitchModule from "@/server/entities/pitch";
import type { Sheet } from "@/server/entities/sheet";

export const getMockInstrument = (sheet?: Sheet): Instrument => {
  const createPitch = jest.requireActual<typeof PitchModule>("@/server/entities/pitch").createPitch;

  return {
    id: "c13d226f-1932-40e2-9fd9-10198c219e33",
    name: "Mocked Instrument",
    type: "Percussion",
    trackCount: 8,
    isFretted: false,
    tuning: [
      PitchModule.NonSilentPitchSchema.parse(createPitch("C", 0)),
      PitchModule.NonSilentPitchSchema.parse(createPitch("C", 0)),
      PitchModule.NonSilentPitchSchema.parse(createPitch("C", 0)),
      PitchModule.NonSilentPitchSchema.parse(createPitch("C", 0)),
      PitchModule.NonSilentPitchSchema.parse(createPitch("C", 0)),
      PitchModule.NonSilentPitchSchema.parse(createPitch("C", 0)),
      PitchModule.NonSilentPitchSchema.parse(createPitch("C", 0)),
      PitchModule.NonSilentPitchSchema.parse(createPitch("C", 0)),
    ],
    sheet,
  };
};
