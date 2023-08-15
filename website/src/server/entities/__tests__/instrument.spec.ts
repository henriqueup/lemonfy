import { createPitch } from "@/server/entities/pitch";
import { createInstrument } from "@entities/instrument";
import { z } from "zod";

describe("Create Instrument", () => {
  it("Creates generic Instrument with valid values", () => {
    const tuning = [
      createPitch("X", 0),
      createPitch("X", 0),
      createPitch("X", 0),
    ];
    const newInstrument = createInstrument(
      "Test instrument",
      "Percussion",
      3,
      tuning,
      false,
    );

    expect(newInstrument.name).toBe("Test instrument");
    expect(newInstrument.type).toBe("Percussion");
    expect(newInstrument.trackCount).toBe(3);
    expect(newInstrument.tuning).toEqual(tuning);
    expect(newInstrument.isFretted).toBe(false);
  });

  it("Creates Key Instrument with valid values", () => {
    const tuning = [createPitch("X", 0)];
    const newInstrument = createInstrument(
      "Test instrument",
      "Key",
      3,
      tuning,
      false,
    );

    expect(newInstrument.name).toBe("Test instrument");
    expect(newInstrument.type).toBe("Key");
    expect(newInstrument.trackCount).toBe(3);
    expect(newInstrument.tuning).toEqual(tuning);
    expect(newInstrument.isFretted).toBe(false);
  });

  it("Fails to create generic Instrument with invalid tuning", () => {
    const tuning = [createPitch("X", 0), createPitch("X", 0)];

    expect(() =>
      createInstrument("Test instrument", "Percussion", 3, tuning, false),
    ).toThrow(
      new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          path: ["tuning"],
          message:
            "An Instrument's tuning should match it's track count, except for 'Key' Instruments which should only have a base key.",
        },
      ]),
    );
  });

  it("Fails to create Key Instrument with invalid tuning", () => {
    const tuning = [
      createPitch("X", 0),
      createPitch("X", 0),
      createPitch("X", 0),
    ];

    expect(() =>
      createInstrument("Test instrument", "Key", 3, tuning, false),
    ).toThrow(
      new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          path: ["tuning"],
          message:
            "An Instrument's tuning should match it's track count, except for 'Key' Instruments which should only have a base key.",
        },
      ]),
    );
  });
});
