import { getCompleteMoonlightSonataMockSheet } from "@/mocks/entities/sheet";
import {
  AudioContextMock,
  GainNodeMock,
  OscillatorNodeMock,
} from "@/mocks/window";
import { createBarAudioNodes } from "src/utils/audioContext";
import { toPrecision } from "src/utils/numbers";
import { cropBar, setBarTimesInSeconds } from "@/server/entities/bar";

jest.mock("@entities/bar");
jest.mock("@entities/sheet");

describe("Creates Audio Nodes from Bar", () => {
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
      createBarAudioNodes(
        sonataSheet.bars[1],
        audioContextMock as AudioContext,
        0,
      ),
    ).toThrowError("Invalid bar: undefined startInSeconds.");
  });

  it("Fails with note without start in seconds", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    sonataSheet.bars[1]!.tracks[2]![3]!.startInSeconds = undefined;

    expect(() =>
      createBarAudioNodes(
        sonataSheet.bars[1],
        audioContextMock as AudioContext,
        0,
      ),
    ).toThrowError("Invalid note: '5', undefined startInSeconds.");
  });

  it("Fails with note without duration in seconds", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    sonataSheet.bars[1]!.tracks[2]![3]!.durationInSeconds = undefined;

    expect(() =>
      createBarAudioNodes(
        sonataSheet.bars[1],
        audioContextMock as AudioContext,
        0,
      ),
    ).toThrowError("Invalid note: '5', undefined durationInSeconds.");
  });

  it("Creates Audio Nodes from Bar without start offset and without cropping", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    const bar = sonataSheet.bars[1]!;
    const audioNodes = createBarAudioNodes(
      bar,
      audioContextMock as AudioContext,
      0,
    );

    bar.start = 0;
    expect(cropBar).toHaveBeenCalledWith(bar, 1);

    expect(setBarTimesInSeconds).toHaveBeenCalledTimes(1);
    expect(setBarTimesInSeconds).toHaveBeenCalledWith(bar);

    expect(mockGainNodes).toHaveLength(14);
    expect(mockOscillatorNodes).toHaveLength(14);

    const notes = bar.tracks.flat();
    for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
      const note = notes[noteIndex]!;
      const mockGainNode = mockGainNodes[noteIndex]!;
      const mockOscillatorNode = mockOscillatorNodes[noteIndex]!;

      expect(mockGainNode.gain.setValueAtTime).toBeCalledTimes(3);
      expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(1, 0, 0);
      expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
        2,
        0.2,
        toPrecision(bar.startInSeconds! + note.startInSeconds!),
      );
      expect(mockGainNode.gain.setValueAtTime).toHaveBeenNthCalledWith(
        3,
        0,
        toPrecision(
          bar.startInSeconds! + note.startInSeconds! + note.durationInSeconds!,
        ),
      );

      expect(mockOscillatorNode.connect).toHaveBeenCalledTimes(1);
      expect(mockOscillatorNode.connect).toHaveBeenCalledWith(mockGainNode);
      expect(mockOscillatorNode.frequency.value).toBe(note.pitch.frequency);
      expect(mockOscillatorNode.start).toHaveBeenCalled();

      expect(audioNodes[2 * noteIndex]).toBe(mockGainNode);
      expect(audioNodes[2 * noteIndex + 1]).toBe(mockOscillatorNode);
    }
  });

  it("Creates Audio Nodes from Bar without start offset but with cropping", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    const bar = sonataSheet.bars[1]!;
    const audioNodes = createBarAudioNodes(
      bar,
      audioContextMock as AudioContext,
      0,
      1 / 2,
    );

    bar.start = 0;
    expect(cropBar).toHaveBeenCalledTimes(1);
    expect(cropBar).toHaveBeenCalledWith(bar, 1 + 1 / 2);

    expect(setBarTimesInSeconds).toHaveBeenCalledTimes(1);
    expect(setBarTimesInSeconds).toHaveBeenCalledWith(bar);

    expect(mockGainNodes).toHaveLength(14);
    expect(mockOscillatorNodes).toHaveLength(14);
    expect(audioNodes).toHaveLength(28);
  });

  it("Creates Audio Nodes from Bar with start offset but without cropping", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    const bar = sonataSheet.bars[1]!;
    const audioNodes = createBarAudioNodes(
      bar,
      audioContextMock as AudioContext,
      1 / 2,
    );

    bar.start = 1 / 2;
    expect(cropBar).toHaveBeenCalledTimes(1);
    expect(cropBar).toHaveBeenCalledWith(bar, 1);

    expect(setBarTimesInSeconds).toHaveBeenCalledTimes(1);
    expect(setBarTimesInSeconds).toHaveBeenCalledWith(bar);

    expect(mockGainNodes).toHaveLength(14);
    expect(mockOscillatorNodes).toHaveLength(14);
    expect(audioNodes).toHaveLength(28);
  });

  it("Creates Audio Nodes from Bar with start offset and with cropping", () => {
    const sonataSheet = getCompleteMoonlightSonataMockSheet();
    const bar = sonataSheet.bars[1]!;
    const audioNodes = createBarAudioNodes(
      bar,
      audioContextMock as AudioContext,
      1 / 2,
      1 / 2,
    );

    bar.start = 1 / 2;
    expect(cropBar).toHaveBeenCalledTimes(1);
    expect(cropBar).toHaveBeenCalledWith(bar, 1 + 1 / 2);

    expect(setBarTimesInSeconds).toHaveBeenCalledTimes(1);
    expect(setBarTimesInSeconds).toHaveBeenCalledWith(bar);

    expect(mockGainNodes).toHaveLength(14);
    expect(mockOscillatorNodes).toHaveLength(14);
    expect(audioNodes).toHaveLength(28);
  });
});
