/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NOTE_DURATIONS } from "@entities/note";
import {
  addBarToSheet,
  createSheet,
  addNoteToSheet,
  findSheetNoteByTime,
  removeNotesFromSheet,
  fillBarTracksInSheet,
  playSong,
  removeBarInSheetByIndex,
} from "@entities/sheet";
import {
  getEmptyMockSheet,
  getMockSheetWithNoGap,
  getMockSheetWithBars,
  getMockSheetWithGap,
  getCompleteMoonlightSonataMockSheet,
} from "src/mocks/entities/sheet";
import * as BarModule from "@entities/bar";
import * as MockUtilsModule from "src/mocks/utils/moduleUtils";
import { mockDefaultImplementations } from "src/mocks/entities/bar";
import { createNoteMock } from "src/mocks/entities/note";
import { AudioContextMock, GainNodeMock, OscillatorNodeMock } from "@mocks/window";

jest.mock<typeof BarModule>("@entities/bar", () => {
  const mockUtils = jest.requireActual<typeof MockUtilsModule>("src/mocks/utils/moduleUtils");
  return mockUtils.mockModuleFunctions(jest.requireActual("@entities/bar"));
});

beforeEach(() => {
  MockUtilsModule.restoreMocks(BarModule);
  mockDefaultImplementations(BarModule);
});

describe("Create Sheet", () => {
  it("Creates Sheet with initial values", () => {
    const newSheet = createSheet(3);

    expect(newSheet.bars).toHaveLength(0);
    expect(newSheet.trackCount).toBe(3);

    expect(newSheet.tracks).toHaveLength(3);
    expect(newSheet.tracks[0]).toHaveLength(0);
    expect(newSheet.tracks[1]).toHaveLength(0);
    expect(newSheet.tracks[2]).toHaveLength(0);
  });
});

describe("Add Bar to Sheet", () => {
  it("Adds Bar to empty Sheet", () => {
    const emptySheet = getEmptyMockSheet();

    addBarToSheet(emptySheet, 4, 4, 60);

    expect(BarModule.sumBarsCapacity).toBeCalledTimes(1);
    expect(BarModule.sumBarsCapacity).toBeCalledWith(emptySheet.bars);
    expect(BarModule.createBar).toBeCalledTimes(1);

    expect(emptySheet.bars).toHaveLength(1);
    const addedBar = emptySheet.bars[0]!;

    expect(addedBar.trackCount).toBe(emptySheet.trackCount);
    expect(addedBar.start).toBe(8);
    expect(addedBar.index).toBe(0);
    expect(addedBar.beatCount).toBe(4);
    expect(addedBar.dibobinador).toBe(4);
    expect(addedBar.tempo).toBe(60);
  });

  it("Adds Bar to Sheet with previous bars", () => {
    const sheetWithBars = getMockSheetWithBars();
    addBarToSheet(sheetWithBars, 4, 4, 100);

    expect(sheetWithBars.bars).toHaveLength(4);
    const addedBar = sheetWithBars.bars[3]!;

    expect(addedBar.trackCount).toBe(sheetWithBars.trackCount);
    expect(addedBar.start).toBe(8);
    expect(addedBar.index).toBe(3);
    expect(addedBar.beatCount).toBe(4);
    expect(addedBar.dibobinador).toBe(4);
    expect(addedBar.tempo).toBe(100);
  });
});

describe("Add Note to Sheet", () => {
  it("Fails with invalid track index", () => {
    const emptySheet = getEmptyMockSheet();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["HALF"], 0);

    expect(() => addNoteToSheet(emptySheet, 4, noteToAdd)).toThrowError("Invalid track index.");
  });

  it("Fails with invalid track at index", () => {
    const emptySheet = getEmptyMockSheet();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["HALF"], 0);
    delete emptySheet.tracks[1];

    expect(() => addNoteToSheet(emptySheet, 1, noteToAdd)).toThrowError("Invalid track at index: 1.");
  });

  it("Fails with Sheet with no Bars", () => {
    const emptySheet = getEmptyMockSheet();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["HALF"], 0);

    expect(() => addNoteToSheet(emptySheet, 1, noteToAdd)).toThrowError("Sheet should have ate least one Bar.");
  });

  it("Adds Note within a Bar of Sheet without Notes", () => {
    const sheet = getMockSheetWithBars();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["HALF"], 1);

    addNoteToSheet(sheet, 2, noteToAdd);

    const trackWithNewNote = sheet.tracks[2]!;
    expect(trackWithNewNote).toHaveLength(1);

    const noteAdded = trackWithNewNote[0]!;
    expect(noteAdded).toBe(noteToAdd);

    expect(sheet.bars).toHaveLength(3);
  });

  it("Adds Note after last Bar of Sheet", () => {
    const sheet = getMockSheetWithBars();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["QUARTER"], 3);

    addNoteToSheet(sheet, 1, noteToAdd);

    const trackWithNewNote = sheet.tracks[1]!;
    expect(trackWithNewNote).toHaveLength(1);

    const noteAdded = trackWithNewNote[0]!;
    expect(noteAdded).toBe(noteToAdd);

    expect(sheet.bars).toHaveLength(4);
    const previousBar = sheet.bars[2]!;
    const addedBar = sheet.bars[3]!;

    expect(addedBar.trackCount).toBe(sheet.trackCount);
    expect(addedBar.start).toBe(8);
    expect(addedBar.index).toBe(3);
    expect(addedBar.beatCount).toBe(previousBar.beatCount);
    expect(addedBar.dibobinador).toBe(previousBar.dibobinador);
    expect(addedBar.tempo).toBe(previousBar.tempo);
  });

  it("Adds Note that doesn't fit last Bar of Sheet", () => {
    const sheet = getMockSheetWithBars();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["WHOLE"], 2);

    addNoteToSheet(sheet, 1, noteToAdd);

    const trackWithNewNote = sheet.tracks[1]!;
    expect(trackWithNewNote).toHaveLength(1);

    const noteAdded = trackWithNewNote[0]!;
    expect(noteAdded).toBe(noteToAdd);

    expect(sheet.bars).toHaveLength(4);
    const previousBar = sheet.bars[2]!;
    const addedBar = sheet.bars[3]!;

    expect(addedBar.trackCount).toBe(sheet.trackCount);
    expect(addedBar.start).toBe(8);
    expect(addedBar.index).toBe(3);
    expect(addedBar.beatCount).toBe(previousBar.beatCount);
    expect(addedBar.dibobinador).toBe(previousBar.dibobinador);
    expect(addedBar.tempo).toBe(previousBar.tempo);
  });

  it("Adds Note between Notes without gaps", () => {
    const sheet = getMockSheetWithNoGap();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["HALF"], 1 / 4);

    addNoteToSheet(sheet, 0, noteToAdd);

    const trackWithNewNote = sheet.tracks[0]!;
    expect(trackWithNewNote).toHaveLength(4);

    const noteAdded = trackWithNewNote[1]!;
    expect(noteAdded).toBe(noteToAdd);

    expect(trackWithNewNote[2]!.start).toBe(3 / 4);
    expect(trackWithNewNote[3]!.start).toBe(4 / 4);

    expect(sheet.bars).toHaveLength(2);
    const previousBar = sheet.bars[0]!;
    const addedBar = sheet.bars[1]!;

    expect(addedBar.trackCount).toBe(sheet.trackCount);
    expect(addedBar.start).toBe(8);
    expect(addedBar.index).toBe(1);
    expect(addedBar.beatCount).toBe(previousBar.beatCount);
    expect(addedBar.dibobinador).toBe(previousBar.dibobinador);
    expect(addedBar.tempo).toBe(previousBar.tempo);
  });

  it("Adds Note between Notes with gap that fits", () => {
    const sheet = getMockSheetWithGap();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["QUARTER"], 1 / 4);

    addNoteToSheet(sheet, 1, noteToAdd);

    const trackWithNewNote = sheet.tracks[1]!;
    expect(trackWithNewNote).toHaveLength(5);

    const noteAdded = trackWithNewNote[1]!;
    expect(noteAdded).toBe(noteToAdd);

    expect(trackWithNewNote[2]!.start).toBe(2 / 4);
    expect(trackWithNewNote[3]!.start).toBe(3 / 4);
    expect(trackWithNewNote[4]!.start).toBe(5 / 4);

    expect(sheet.bars).toHaveLength(2);
  });

  it("Adds Note between Notes with gap that doesn't fit", () => {
    const sheet = getMockSheetWithGap();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["WHOLE"], 1 / 4);

    addNoteToSheet(sheet, 1, noteToAdd);

    const trackWithNewNote = sheet.tracks[1]!;
    expect(trackWithNewNote).toHaveLength(5);

    const noteAdded = trackWithNewNote[1]!;
    expect(noteAdded).toBe(noteToAdd);

    expect(trackWithNewNote[2]!.start).toBe(5 / 4);
    expect(trackWithNewNote[3]!.start).toBe(6 / 4);
    expect(trackWithNewNote[4]!.start).toBe(7 / 4);

    expect(sheet.bars).toHaveLength(3);
  });

  it("Adds Note between Notes with gaps that fit", () => {
    const sheet = getMockSheetWithGap();
    const noteToAdd = createNoteMock(NOTE_DURATIONS["HALF"], 1 / 4);

    addNoteToSheet(sheet, 1, noteToAdd);

    const trackWithNewNote = sheet.tracks[1]!;
    expect(trackWithNewNote).toHaveLength(5);

    const noteAdded = trackWithNewNote[1]!;
    expect(noteAdded).toBe(noteToAdd);

    expect(trackWithNewNote[2]!.start).toBe(3 / 4);
    expect(trackWithNewNote[3]!.start).toBe(4 / 4);
    expect(trackWithNewNote[4]!.start).toBe(5 / 4);

    expect(sheet.bars).toHaveLength(2);
  });
});

describe("Find Note by time", () => {
  it("Fails with invalid track index", () => {
    const emptySheet = getEmptyMockSheet();

    expect(() => findSheetNoteByTime(emptySheet, 4, 1)).toThrowError("Invalid track index.");
  });

  it("Fails with invalid track at index", () => {
    const emptySheet = getEmptyMockSheet();
    delete emptySheet.tracks[1];

    expect(() => findSheetNoteByTime(emptySheet, 1, 1)).toThrowError("Invalid track at index: 1.");
  });

  it("Returns null when looking forward with end of Note", () => {
    const sheet = getMockSheetWithGap();
    const result = findSheetNoteByTime(sheet, 1, 1 / 4);

    expect(result).toBeNull();
  });

  it("Returns null when looking backward with start of Note", () => {
    const sheet = getMockSheetWithGap();
    const result = findSheetNoteByTime(sheet, 1, 2 / 4, false);

    expect(result).toBeNull();
  });

  it("Returns null in time without Notes when looking forward", () => {
    const sheet = getMockSheetWithGap();
    const result = findSheetNoteByTime(sheet, 1, 3 / 8);

    expect(result).toBeNull();
  });

  it("Returns null in time without Notes when looking backward", () => {
    const sheet = getMockSheetWithGap();
    const result = findSheetNoteByTime(sheet, 1, 3 / 8, false);

    expect(result).toBeNull();
  });

  it("Returns Note when looking forward with start of Note", () => {
    const sheet = getMockSheetWithGap();
    const result = findSheetNoteByTime(sheet, 1, 2 / 4);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(2 / 4);
    expect(result!.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note when looking backward with end of Note", () => {
    const sheet = getMockSheetWithGap();
    const result = findSheetNoteByTime(sheet, 1, 1 / 4, false);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(0);
    expect(result!.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note when looking forward within Note", () => {
    const sheet = getMockSheetWithGap();
    const result = findSheetNoteByTime(sheet, 1, 5 / 8);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(2 / 4);
    expect(result!.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });

  it("Returns Note when looking backward within Note", () => {
    const sheet = getMockSheetWithGap();
    const result = findSheetNoteByTime(sheet, 1, 1 / 8, false);

    expect(result).toBeTruthy();
    expect(result!.start).toBe(0);
    expect(result!.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });
});

describe("Remove Notes from Sheet", () => {
  it("Fails with invalid track index", () => {
    const emptySheet = getEmptyMockSheet();

    expect(() => removeNotesFromSheet(emptySheet, 4, [])).toThrowError("Invalid track index.");
  });

  it("Fails with invalid track at index", () => {
    const emptySheet = getEmptyMockSheet();
    delete emptySheet.tracks[1];

    expect(() => removeNotesFromSheet(emptySheet, 1, [])).toThrowError("Invalid track at index: 1.");
  });

  it("Does nothing with empty array", () => {
    const sheet = getMockSheetWithGap();

    removeNotesFromSheet(sheet, 1, []);

    expect(sheet.tracks[1]).toHaveLength(4);
  });

  it("Removes single Note", () => {
    const sheet = getMockSheetWithGap();
    const noteToRemove = sheet.tracks[1]![1]!;

    removeNotesFromSheet(sheet, 1, [noteToRemove]);

    expect(sheet.tracks[1]).toHaveLength(3);

    const firstNote = sheet.tracks[1]![0]!;
    expect(firstNote.start).toBe(0);
    expect(firstNote.duration).toBe(NOTE_DURATIONS["QUARTER"]);

    const secondNote = sheet.tracks[1]![1]!;
    expect(secondNote.start).toBe(3 / 4);
    expect(secondNote.duration).toBe(NOTE_DURATIONS["QUARTER"]);

    const thirdNote = sheet.tracks[1]![2]!;
    expect(thirdNote.start).toBe(5 / 4);
    expect(thirdNote.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });

  it("Removes multiple Notes", () => {
    const sheet = getMockSheetWithGap();
    const noteToRemoves = [sheet.tracks[1]![1]!, sheet.tracks[1]![3]!];

    removeNotesFromSheet(sheet, 1, noteToRemoves);

    expect(sheet.tracks[1]).toHaveLength(2);

    const firstNote = sheet.tracks[1]![0]!;
    expect(firstNote.start).toBe(0);
    expect(firstNote.duration).toBe(NOTE_DURATIONS["QUARTER"]);

    const secondNote = sheet.tracks[1]![1]!;
    expect(secondNote.start).toBe(3 / 4);
    expect(secondNote.duration).toBe(NOTE_DURATIONS["QUARTER"]);
  });
});

describe("Fill Bar tracks in Sheet", () => {
  it("Fails with invalid Bar", () => {
    const sheet = getMockSheetWithBars();
    delete sheet.bars[1];

    expect(() => fillBarTracksInSheet(sheet, 1)).toThrowError("Bar at index 1 should exist.");
  });

  it("Fails with invalid track", () => {
    const sheet = getMockSheetWithBars();

    expect(() => fillBarTracksInSheet(sheet, 4)).toThrowError("Track at index 4 should exist.");
  });

  it("Empties Bars with empty track", () => {
    const sheet = getMockSheetWithBars();
    sheet.bars[0]!.tracks[0]!.push(createNoteMock(NOTE_DURATIONS["QUARTER"], 0));
    sheet.bars[1]!.tracks[0]!.push(createNoteMock(NOTE_DURATIONS["QUARTER"], 3 / 4));
    sheet.bars[2]!.tracks[0]!.push(createNoteMock(NOTE_DURATIONS["QUARTER"], 1 + 3 / 4));

    fillBarTracksInSheet(sheet, 0);

    expect(BarModule.fillBarTrack).not.toHaveBeenCalled();
    expect(sheet.bars[0]!.tracks[0]).toHaveLength(0);
    expect(sheet.bars[1]!.tracks[0]).toHaveLength(0);
    expect(sheet.bars[2]!.tracks[0]).toHaveLength(0);
  });

  it("Fills the track in each Bar", () => {
    const sheet = getMockSheetWithGap();

    fillBarTracksInSheet(sheet, 1);

    expect(BarModule.fillBarTrack).toBeCalledTimes(2);

    const targetTrack = sheet.tracks[1]!;
    const firstBar = sheet.bars[0]!;
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(1, firstBar, targetTrack, 1);

    const secondBar = sheet.bars[1]!;
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(2, secondBar, targetTrack, 1);
  });
});

describe("Remove Bar by index", () => {
  it("Fails with invalid Bar", () => {
    const sheet = getCompleteMoonlightSonataMockSheet();

    expect(() => removeBarInSheetByIndex(sheet, 5)).toThrow("Invalid bar at index 5.");

    delete sheet.bars[1];
    expect(() => removeBarInSheetByIndex(sheet, 1)).toThrow("Invalid bar at index 1.");
  });

  it("Removes Bar and all Notes in it", () => {
    const sheet = getCompleteMoonlightSonataMockSheet();

    removeBarInSheetByIndex(sheet, 1);

    expect(sheet.bars).toHaveLength(3);
    expect(sheet.bars[0]!.index).toBe(0);
    expect(sheet.bars[1]!.index).toBe(1);
    expect(sheet.bars[2]!.index).toBe(2);

    expect(sheet.tracks[0]).toHaveLength(1 + 2 + 1);
    expect(sheet.tracks[1]).toHaveLength(1 + 2 + 1);
    expect(sheet.tracks[2]).toHaveLength(12 + 12 + 12);

    expect(BarModule.fillBarTrack).toHaveBeenCalledTimes(9);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(1, sheet.bars[0], sheet.tracks[0], 0);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(2, sheet.bars[1], sheet.tracks[0], 0);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(3, sheet.bars[2], sheet.tracks[0], 0);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(4, sheet.bars[0], sheet.tracks[1], 1);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(5, sheet.bars[1], sheet.tracks[1], 1);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(6, sheet.bars[2], sheet.tracks[1], 1);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(7, sheet.bars[0], sheet.tracks[2], 2);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(8, sheet.bars[1], sheet.tracks[2], 2);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(9, sheet.bars[2], sheet.tracks[2], 2);
  });

  it("Removes sustain Notes from remaining Bars", () => {
    const sheet = getCompleteMoonlightSonataMockSheet();

    sheet.tracks[2]!.splice(12, 1); // delete first note of second bar
    sheet.tracks[2]![11]!.duration = NOTE_DURATIONS["QUARTER_TRIPLET"]; // make last note of first bar sustain into second bar

    sheet.tracks[2]!.splice(23, 1); // delete first note of third bar
    sheet.tracks[2]![22]!.duration = NOTE_DURATIONS["QUARTER_TRIPLET"]; // make last note of second bar sustain into third bar

    removeBarInSheetByIndex(sheet, 1);

    expect(sheet.bars).toHaveLength(3);
    expect(sheet.tracks[0]).toHaveLength(1 + 2 + 1);
    expect(sheet.tracks[1]).toHaveLength(1 + 2 + 1);
    expect(sheet.tracks[2]).toHaveLength(11 + 11 + 12);

    expect(BarModule.fillBarTrack).toHaveBeenCalledTimes(9);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(1, sheet.bars[0], sheet.tracks[0], 0);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(2, sheet.bars[1], sheet.tracks[0], 0);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(3, sheet.bars[2], sheet.tracks[0], 0);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(4, sheet.bars[0], sheet.tracks[1], 1);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(5, sheet.bars[1], sheet.tracks[1], 1);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(6, sheet.bars[2], sheet.tracks[1], 1);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(7, sheet.bars[0], sheet.tracks[2], 2);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(8, sheet.bars[1], sheet.tracks[2], 2);
    expect(BarModule.fillBarTrack).toHaveBeenNthCalledWith(9, sheet.bars[2], sheet.tracks[2], 2);
  });
});

describe("Play song", () => {
  let audioContextMock: AudioContextMock;
  let mockGainNodes: GainNodeMock[];
  let mockOscillatorNodes: OscillatorNodeMock[];

  beforeEach(() => {
    audioContextMock = new AudioContextMock();

    mockGainNodes = [];
    audioContextMock.createGain.mockImplementation(() => {
      const mockGainNode = new GainNodeMock();
      mockGainNodes.push(mockGainNode);
      return mockGainNode;
    });

    mockOscillatorNodes = [];
    audioContextMock.createOscillator.mockImplementation(() => {
      const mockOscillatorNode = new OscillatorNodeMock();
      mockOscillatorNodes.push(mockOscillatorNode);
      return mockOscillatorNode;
    });
  });

  it("Does nothing with null audio context", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    playSong(sonataSheet, null);

    expect(mockGainNodes).toHaveLength(0);
    expect(mockOscillatorNodes).toHaveLength(0);
  });

  it("Fails with invalid bar", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    delete sonataSheet.bars[1];

    expect(() => playSong(sonataSheet, audioContextMock as AudioContext)).toThrowError("Bar at index 1 should exist.");
  });

  it("Fails with bar without start in seconds", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    sonataSheet.bars[1]!.startInSeconds = undefined;

    expect(() => playSong(sonataSheet, audioContextMock as AudioContext)).toThrowError(
      "Invalid bar at 1: undefined startInSeconds.",
    );
  });

  it("Fails with note without start in seconds", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    sonataSheet.bars[1]!.tracks[2]![3]!.startInSeconds = undefined;

    expect(() => playSong(sonataSheet, audioContextMock as AudioContext)).toThrowError(
      "Invalid note: '5' on bar '1', undefined startInSeconds.",
    );
  });

  it("Fails with note without duration in seconds", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    sonataSheet.bars[1]!.tracks[2]![3]!.durationInSeconds = undefined;

    expect(() => playSong(sonataSheet, audioContextMock as AudioContext)).toThrowError(
      "Invalid note: '5' on bar '1', undefined durationInSeconds.",
    );
  });

  it("Plays entire song", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    playSong(sonataSheet, audioContextMock as AudioContext);

    expect(mockGainNodes).toHaveLength(14 + 14 + 16 + 14);
    expect(mockOscillatorNodes).toHaveLength(14 + 14 + 16 + 14);

    const firstNoteIndexPerBar = [0, 14, 28, 44];
    for (let barIndex = 0; barIndex < sonataSheet.bars.length; barIndex++) {
      const bar = sonataSheet.bars[barIndex]!;
      const notes = bar.tracks.flat();

      for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
        const note = notes[noteIndex]!;
        const mockNodeIndex = firstNoteIndexPerBar[barIndex]! + noteIndex;
        const mockGainNode = mockGainNodes[mockNodeIndex]!;
        const mockOscillatorNode = mockOscillatorNodes[mockNodeIndex]!;

        expect(mockGainNode.gain.setValueAtTime).toBeCalledTimes(3);
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(1, 0, 0);
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
          2,
          0.2,
          bar.startInSeconds! + note.startInSeconds!,
        );
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
          3,
          0,
          bar.startInSeconds! + note.startInSeconds! + note.durationInSeconds!,
        );

        expect(mockOscillatorNode.connect).toHaveBeenCalledTimes(1);
        expect(mockOscillatorNode.connect).toHaveBeenCalledWith(mockGainNode);
        expect(mockOscillatorNode.frequency.value).toBe(note.pitch?.frequency);
        expect(mockOscillatorNode.start).toHaveBeenCalled();
      }
    }
  });
});
