import { fillBarsInSheet } from "@entities/sheet";
import { getCompleteMoonlightSonataMockSheet } from "@/mocks/entities/sheet";
import {
  AudioContextMock,
  GainNodeMock,
  OscillatorNodeMock,
} from "@/mocks/window";
import { playSong } from "src/utils/audioContext";
import { toPrecision } from "src/utils/numbers";
import { cropBar, setBarTimesInSeconds } from "@/server/entities/bar";

jest.mock("@entities/bar");
jest.mock("@entities/sheet");

describe("Play song", () => {
  let audioContextMock: AudioContextMock;
  let mockGainNodes: GainNodeMock[];
  let mockOscillatorNodes: OscillatorNodeMock[];

  beforeEach(() => {
    audioContextMock = new AudioContextMock();

    mockGainNodes = [];
    (audioContextMock.createGain as jest.Mock).mockImplementation(() => {
      const mockGainNode = new GainNodeMock();
      mockGainNodes.push(mockGainNode);
      return mockGainNode;
    });

    mockOscillatorNodes = [];
    (audioContextMock.createOscillator as jest.Mock).mockImplementation(() => {
      const mockOscillatorNode = new OscillatorNodeMock();
      mockOscillatorNodes.push(mockOscillatorNode);
      return mockOscillatorNode;
    });
  });

  it("Fails with bar without start in seconds", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    sonataSheet.bars[1]!.startInSeconds = undefined;

    expect(() =>
      playSong(sonataSheet, audioContextMock as AudioContext),
    ).toThrowError("Invalid bar at 1: undefined startInSeconds.");
  });

  it("Fails with note without start in seconds", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    sonataSheet.bars[1]!.tracks[2]![3]!.startInSeconds = undefined;

    expect(() =>
      playSong(sonataSheet, audioContextMock as AudioContext),
    ).toThrowError("Invalid note: '5', undefined startInSeconds.");
  });

  it("Fails with note without duration in seconds", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    sonataSheet.bars[1]!.tracks[2]![3]!.durationInSeconds = undefined;

    expect(() =>
      playSong(sonataSheet, audioContextMock as AudioContext),
    ).toThrowError("Invalid note: '5', undefined durationInSeconds.");
  });

  it("Plays entire song", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    playSong(sonataSheet, audioContextMock as AudioContext);

    expect(fillBarsInSheet).toHaveBeenCalledTimes(1);
    expect(cropBar).not.toHaveBeenCalled();
    expect(setBarTimesInSeconds).toHaveBeenCalledTimes(4);

    expect(mockGainNodes).toHaveLength(14 + 14 + 16 + 14);
    expect(mockOscillatorNodes).toHaveLength(14 + 14 + 16 + 14);

    const firstNoteIndexPerBar = [0, 14, 28, 44];
    for (let barIndex = 0; barIndex < sonataSheet.bars.length; barIndex++) {
      const bar = sonataSheet.bars[barIndex]!;
      expect(setBarTimesInSeconds).toHaveBeenNthCalledWith(barIndex + 1, bar);

      const notes = bar.tracks.flat();
      for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
        const note = notes[noteIndex]!;
        const mockNodeIndex = firstNoteIndexPerBar[barIndex]! + noteIndex;
        const mockGainNode = mockGainNodes[mockNodeIndex]!;
        const mockOscillatorNode = mockOscillatorNodes[mockNodeIndex]!;

        expect(mockGainNode.gain.setValueAtTime).toBeCalledTimes(3);
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
          1,
          0,
          0,
        );
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
          2,
          0.2,
          toPrecision(bar.startInSeconds! + note.startInSeconds!),
        );
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
          3,
          0,
          toPrecision(
            bar.startInSeconds! +
              note.startInSeconds! +
              note.durationInSeconds!,
          ),
        );

        expect(mockOscillatorNode.connect).toHaveBeenCalledTimes(1);
        expect(mockOscillatorNode.connect).toHaveBeenCalledWith(mockGainNode);
        expect(mockOscillatorNode.frequency.value).toBe(note.pitch.frequency);
        expect(mockOscillatorNode.start).toHaveBeenCalled();
      }
    }
  });

  it("Plays song starting after start", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    const start = 2 + 2 / 12;
    playSong(sonataSheet, audioContextMock as AudioContext, start);

    expect(fillBarsInSheet).toHaveBeenCalledTimes(1);

    sonataSheet.bars[2]!.start = 0;
    sonataSheet.bars[3]!.start -= start;
    expect(cropBar).toHaveBeenCalledTimes(1);
    expect(cropBar).toHaveBeenCalledWith(sonataSheet.bars[2], start);
    expect(setBarTimesInSeconds).toHaveBeenCalledTimes(2);

    expect(mockGainNodes).toHaveLength(16 + 14);
    expect(mockOscillatorNodes).toHaveLength(16 + 14);

    sonataSheet.bars = [sonataSheet.bars[2]!, sonataSheet.bars[3]!];
    const firstNoteIndexPerBar = [0, 16];
    for (let barIndex = 0; barIndex < sonataSheet.bars.length; barIndex++) {
      const bar = sonataSheet.bars[barIndex]!;
      expect(setBarTimesInSeconds).toHaveBeenNthCalledWith(barIndex + 1, bar);

      const notes = bar.tracks.flat();
      for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
        const note = notes[noteIndex]!;
        const mockNodeIndex = firstNoteIndexPerBar[barIndex]! + noteIndex;
        const mockGainNode = mockGainNodes[mockNodeIndex]!;
        const mockOscillatorNode = mockOscillatorNodes[mockNodeIndex]!;

        expect(mockGainNode.gain.setValueAtTime).toBeCalledTimes(3);
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
          1,
          0,
          0,
        );
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
          2,
          0.2,
          toPrecision(bar.startInSeconds! + note.startInSeconds!),
        );
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
          3,
          0,
          toPrecision(
            bar.startInSeconds! +
              note.startInSeconds! +
              note.durationInSeconds!,
          ),
        );

        expect(mockOscillatorNode.connect).toHaveBeenCalledTimes(1);
        expect(mockOscillatorNode.connect).toHaveBeenCalledWith(mockGainNode);
        expect(mockOscillatorNode.frequency.value).toBe(note.pitch.frequency);
        expect(mockOscillatorNode.start).toHaveBeenCalled();
      }
    }
  });
});
