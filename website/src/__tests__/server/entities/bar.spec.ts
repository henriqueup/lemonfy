/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createBar, fillBarTrack, findBarNoteByTime, setBarNotesTimesInSeconds, sumBarsCapacity } from "@entities/bar";
import { createNote, NOTE_DURATIONS } from "@entities/note";
import { createBarMock, getFilledMockBar } from "src/mocks/entities/bar";
import { getEmptyMockSheet, getMockSheetWithBars } from "src/mocks/entities/sheet";
import * as SheetModule from "@entities/sheet";
import type * as MockUtilsModule from "src/mocks/utils";
import { SECONDS_PER_MINUTE } from "@entities/timeEvaluation";
import { createNoteMock } from "src/mocks/entities/note";

jest.mock<typeof SheetModule>("@entities/sheet", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>("src/mocks/utils");
  return mockUtils.mockModuleFunctions(jest.requireActual("@entities/sheet"));
});

describe("Create Bar", () => {
  it("Creates Bar with initial values", () => {
    const newBar = createBar(3, 3, 4, 3 / 4, 80);

    expect(newBar.beatCount).toBe(3);
    expect(newBar.dibobinador).toBe(4);
    expect(newBar.capacity).toBe(3 / 4);
    expect(newBar.start).toBe(3 / 4);
    expect(newBar.tempo).toBe(80);
    expect(newBar.timeRatio).toBe(80 / SECONDS_PER_MINUTE);
    expect(newBar.trackCount).toBe(3);

    expect(newBar.tracks).toHaveLength(3);
    expect(newBar.tracks[0]).toHaveLength(0);
    expect(newBar.tracks[1]).toHaveLength(0);
    expect(newBar.tracks[2]).toHaveLength(0);

    expect(newBar.index).toBeUndefined();
  });
});

describe("Sum Bar capacity", () => {
  it("Sums empty Bar array capacity to 0", () => {
    const totalCapacity = sumBarsCapacity([]);

    expect(totalCapacity).toBe(0);
  });

  it("Sums Bar array capacity", () => {
    const bars = [
      createBarMock(3, 4, 4, 0, 60, 0), // capacity = 1
      createBarMock(3, 3, 4, 1, 60, 1), // capacity = 3 / 4
      createBarMock(3, 5, 4, 2, 60, 2), // capacity = 5 / 4
      createBarMock(3, 6, 8, 3, 60, 3), // capacity = 6 / 8
    ];

    const totalCapacity = sumBarsCapacity(bars);

    expect(totalCapacity).toBe(1 + 3 / 4 + 5 / 4 + 6 / 8);
  });
});

describe("Set Notes times in seconds", () => {
  // it("Fails with invalid Note at index", () => {
  //   const bar = getBarWithNotes();
  //   delete bar.tracks[1]![1];

  //   setBarNotesTimesInSeconds(bar);
  //   expect(() => setBarNotesTimesInSeconds(bar)).toThrowError("The note at index 3 should exist.");
  // });

  it("Sets times in seconds of all Notes", () => {
    const bar = getFilledMockBar();

    setBarNotesTimesInSeconds(bar);

    bar.tracks.forEach(track => {
      track.forEach(note => {
        expect(note.startInSeconds).toBe((note.start * bar.dibobinador) / bar.timeRatio);
        expect(note.durationInSeconds).toBe((note.duration * bar.dibobinador) / bar.timeRatio);
      });
    });
  });
});

describe("Fill track", () => {
  // it("Fails with invalid Bar", () => {
  //   const sheet = getEmptyMockSheet();
  //   expect(() => fillBarTrackInSheet(sheet, 1, 1)).toThrowError("Bar at index 1 should exist.");
  // });
  // it("Fails with invalid track", () => {
  //   const sheet = getMockSheetWithBars();
  //   expect(() => fillBarTrackInSheet(sheet, 1, 4)).toThrowError("Track at index 4 should exist.");
  // });
  // it("Does nothing with empty track", () => {
  //   const sheet = getMockSheetWithBars();
  //   fillBarTrackInSheet(sheet, 1, 0);
  //   expect(sheet.bars[1]!.tracks[0]).toHaveLength(0);
  // });
  // it("Does nothing with no Notes within Bar", () => {
  //   const sheet = getMockSheetWithBars();
  //   sheet.tracks[0]!.push(createNote(NOTE_DURATIONS["HALF"], 0));
  //   sheet.tracks[0]!.push(createNote(NOTE_DURATIONS["HALF"], 1 + 3 / 4));
  //   const spy = jest.spyOn(SheetModule, "findSheetNoteByTime");
  //   spy.mockImplementationOnce(() => null).mockImplementationOnce(() => null);
  //   fillBarTrackInSheet(sheet, 1, 0);
  //   expect(sheet.bars[1]!.tracks[0]).toHaveLength(0);
  // });
  // it("Fills Bar only with Notes inside", () => {
  //   const sheet = getMockSheetWithBars();
  //   sheet.tracks[0]!.push(createNote(NOTE_DURATIONS["EIGHTH"], 7 / 8));
  //   sheet.tracks[0]!.push(createNote(NOTE_DURATIONS["HALF"], 8 / 8));
  //   const spy = jest.spyOn(SheetModule, "findSheetNoteByTime");
  //   spy.mockImplementationOnce(() => null).mockImplementationOnce(() => null);
  //   fillBarTrackInSheet(sheet, 1, 0);
  //   const barTrack = sheet.bars[1]!.tracks[0]!;
  //   expect(barTrack).toHaveLength(2);
  //   const firstNote = barTrack[0]!;
  //   expect(firstNote.duration).toBe(NOTE_DURATIONS["EIGHTH"]);
  //   expect(firstNote.start).toBe(1 / 8);
  //   expect(firstNote.hasSustain).toBe(false);
  //   expect(firstNote.isSustain).toBe(false);
  //   const secondNote = barTrack[1]!;
  //   expect(secondNote.duration).toBe(NOTE_DURATIONS["HALF"]);
  //   expect(secondNote.start).toBe(2 / 8);
  //   expect(secondNote.hasSustain).toBe(false);
  //   expect(secondNote.isSustain).toBe(false);
  // });
  // it("Fills entire Bar without sustains", () => {
  //   const sheet = getMockSheetWithBars();
  //   const startNote = createNote(NOTE_DURATIONS["HALF"], 3 / 4);
  //   const endNote = createNote(NOTE_DURATIONS["HALF"], 5 / 4);
  //   sheet.tracks[0]!.push(startNote);
  //   sheet.tracks[0]!.push(endNote);
  //   const spy = jest.spyOn(SheetModule, "findSheetNoteByTime");
  //   spy.mockImplementationOnce(() => startNote).mockImplementationOnce(() => endNote);
  //   fillBarTrackInSheet(sheet, 1, 0);
  //   const barTrack = sheet.bars[1]!.tracks[0]!;
  //   expect(barTrack).toHaveLength(2);
  //   const firstNote = barTrack[0]!;
  //   expect(firstNote.duration).toBe(NOTE_DURATIONS["HALF"]);
  //   expect(firstNote.start).toBe(0);
  //   expect(firstNote.hasSustain).toBe(false);
  //   expect(firstNote.isSustain).toBe(false);
  //   const secondNote = barTrack[1]!;
  //   expect(secondNote.duration).toBe(NOTE_DURATIONS["HALF"]);
  //   expect(secondNote.start).toBe(1 / 2);
  //   expect(secondNote.hasSustain).toBe(false);
  //   expect(secondNote.isSustain).toBe(false);
  // });
  // it("Fills entire Bar with sustains", () => {
  //   const sheet = getMockSheetWithBars();
  //   const startNote = createNote(NOTE_DURATIONS["WHOLE"], 1 / 4);
  //   const endNote = createNote(NOTE_DURATIONS["WHOLE"], 5 / 4);
  //   sheet.tracks[0]!.push(startNote);
  //   sheet.tracks[0]!.push(endNote);
  //   const spy = jest.spyOn(SheetModule, "findSheetNoteByTime");
  //   spy.mockImplementationOnce(() => startNote).mockImplementationOnce(() => endNote);
  //   fillBarTrackInSheet(sheet, 1, 0);
  //   const barTrack = sheet.bars[1]!.tracks[0]!;
  //   expect(barTrack).toHaveLength(2);
  //   const firstNote = barTrack[0]!;
  //   expect(firstNote.duration).toBe(NOTE_DURATIONS["HALF"]);
  //   expect(firstNote.start).toBe(0);
  //   expect(firstNote.hasSustain).toBe(false);
  //   expect(firstNote.isSustain).toBe(true);
  //   const secondNote = barTrack[1]!;
  //   expect(secondNote.duration).toBe(NOTE_DURATIONS["HALF"]);
  //   expect(secondNote.start).toBe(1 / 2);
  //   expect(secondNote.hasSustain).toBe(true);
  //   expect(secondNote.isSustain).toBe(false);
  // });
  // it("Fills entire Bar with one Note which is and has sustain", () => {
  //   const sheet = getMockSheetWithBars();
  //   const note = createNote(NOTE_DURATIONS["DOUBLE_WHOLE"], 1 / 4);
  //   sheet.tracks[0]!.push(note);
  //   const spy = jest.spyOn(SheetModule, "findSheetNoteByTime");
  //   spy.mockImplementationOnce(() => note).mockImplementationOnce(() => note);
  //   fillBarTrackInSheet(sheet, 1, 0);
  //   const barTrack = sheet.bars[1]!.tracks[0]!;
  //   expect(barTrack).toHaveLength(1);
  //   const firstNote = barTrack[0]!;
  //   expect(firstNote.duration).toBe(NOTE_DURATIONS["WHOLE"]);
  //   expect(firstNote.start).toBe(0);
  //   expect(firstNote.hasSustain).toBe(true);
  //   expect(firstNote.isSustain).toBe(true);
  // });
});

describe("Find Note by time", () => {
  it("Fails with invalid track index", () => {
    const bar = getFilledMockBar();

    expect(() => findBarNoteByTime(bar, 4, 1)).toThrowError("Invalid track index.");
  });

  it("Fails with invalid track", () => {
    const bar = getFilledMockBar();
    delete bar.tracks[1];

    expect(() => findBarNoteByTime(bar, 1, 1)).toThrowError("Invalid track at index: 1.");
  });

  it("Returns null when looking forward with end of Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 1 / 4);

    expect(result).toBeNull();
  });

  it("Returns null when looking backward with start of Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 2 / 4, false);

    expect(result).toBeNull();
  });

  it("Returns null in time without Notes when looking forward", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 3 / 8);

    expect(result).toBeNull();
  });

  it("Returns null in time without Notes when looking backward", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 3 / 8, false);

    expect(result).toBeNull();
  });

  it("Returns Note when looking forward with start of Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 2 / 4);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(2 / 4);
    expect(result!.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note when looking backward with end of Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 1 / 4, false);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(0);
    expect(result!.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note when looking forward within Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 5 / 8);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(2 / 4);
    expect(result!.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note when looking backward within Note", () => {
    const bar = getFilledMockBar();
    bar.tracks[1]!.splice(1, 1);
    const result = findBarNoteByTime(bar, 1, 1 / 8, false);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(0);
    expect(result!.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });
});
