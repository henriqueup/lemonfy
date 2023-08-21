import { getMockInstrument } from "@/mocks/entities/instrument";
import { createNoteMock } from "@/mocks/entities/note";
import { getEmptyMockSheet } from "@/mocks/entities/sheet";
import { NOTE_DURATIONS } from "@/server/entities/note";
import {
  NonSilentPitchSchema,
  createPitch,
  createPitchFromKey,
} from "@/server/entities/pitch";
import { addNoteToSheet } from "@/server/entities/sheet";
import {
  addNoteToFrettedInstrument,
  addNoteToInstrument,
  createInstrument,
} from "@entities/instrument";
import { z } from "zod";

jest.mock("@/server/entities/sheet");

describe("Create Instrument", () => {
  it("Creates generic Instrument with valid values", () => {
    const tuning = [
      createPitch("D", 0),
      createPitch("D", 0),
      createPitch("D", 0),
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
    const tuning = [createPitch("D", 0)];
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
    const tuning = [createPitch("D", 0), createPitch("D", 0)];

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
      createPitch("D", 0),
      createPitch("D", 0),
      createPitch("D", 0),
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

describe("Adds Note to Instrument", () => {
  it("Adds the Note to the Instrument's Sheet correctly", () => {
    const sheet = getEmptyMockSheet();
    const instrument = getMockInstrument(sheet);
    const note = createNoteMock(NOTE_DURATIONS.EIGHTH, 0);

    addNoteToInstrument(instrument, 8, note);

    expect(addNoteToSheet).toHaveBeenCalledTimes(1);
    expect(addNoteToSheet).toHaveBeenCalledWith(sheet, 8, note);
  });

  it("Throws with Instrument without a Sheet", () => {
    const instrument = getMockInstrument();
    const note = createNoteMock(NOTE_DURATIONS.EIGHTH, 0);

    expect(() => addNoteToInstrument(instrument, 8, note)).toThrow(
      "Instrument must have a Sheet.",
    );
  });
});

describe("Adds Note to fretted Instrument", () => {
  it("Adds Note of same Octave to the Instrument's Sheet correctly", () => {
    const sheet = getEmptyMockSheet();
    const instrument = getMockInstrument(sheet);
    instrument.type = "String";
    instrument.isFretted = true;
    instrument.tuning[0] = NonSilentPitchSchema.parse(createPitchFromKey("C0"));

    const note = createNoteMock(
      NOTE_DURATIONS.EIGHTH,
      0,
      createPitchFromKey("G#0"),
    );

    addNoteToFrettedInstrument(instrument, 0, 8, NOTE_DURATIONS.EIGHTH, 0);

    expect(addNoteToSheet).toHaveBeenCalledTimes(1);
    expect(addNoteToSheet).toHaveBeenCalledWith(sheet, 0, note);
  });

  it("Adds Note of higher Octave to the Instrument's Sheet correctly", () => {
    const sheet = getEmptyMockSheet();
    const instrument = getMockInstrument(sheet);
    instrument.isFretted = true;
    instrument.tuning[2] = NonSilentPitchSchema.parse(createPitchFromKey("E0"));

    const note = createNoteMock(
      NOTE_DURATIONS.EIGHTH,
      0,
      createPitchFromKey("A#1"),
    );

    addNoteToFrettedInstrument(instrument, 2, 18, NOTE_DURATIONS.EIGHTH, 0);

    expect(addNoteToSheet).toHaveBeenCalledTimes(1);
    expect(addNoteToSheet).toHaveBeenCalledWith(sheet, 2, note);
  });

  it("Throws with Instrument without frets", () => {
    const instrument = getMockInstrument();

    expect(() =>
      addNoteToFrettedInstrument(instrument, 0, 8, NOTE_DURATIONS.EIGHTH, 0),
    ).toThrow("Instrument must be fretted.");
  });

  it("Throws with invalid track index", () => {
    const instrument = getMockInstrument();
    instrument.isFretted = true;

    expect(() =>
      addNoteToFrettedInstrument(instrument, 8, 8, NOTE_DURATIONS.EIGHTH, 0),
    ).toThrow("Invalid track index.");
  });

  it("Throws with invalid Octave", () => {
    const instrument = getMockInstrument();
    instrument.isFretted = true;
    instrument.tuning[2] = NonSilentPitchSchema.parse(createPitchFromKey("E5"));

    expect(() =>
      addNoteToFrettedInstrument(instrument, 2, 18, NOTE_DURATIONS.EIGHTH, 0),
    ).toThrow(/invalid_union/);
  });
});
