import type { Instrument } from "@/server/entities/instrument";
import { createPitch } from "@/server/entities/pitch";
import type { Sheet } from "@/server/entities/sheet";

export const getMockInsturment = (sheet?: Sheet): Instrument => {
  return {
    id: "c13d226f-1932-40e2-9fd9-10198c219e33",
    name: "Mocked Instrument",
    type: "Percussion",
    trackCount: 8,
    isFretted: false,
    tuning: [
      createPitch("X", 0),
      createPitch("X", 0),
      createPitch("X", 0),
      createPitch("X", 0),
      createPitch("X", 0),
      createPitch("X", 0),
      createPitch("X", 0),
      createPitch("X", 0),
    ],
    sheet,
  };
};
