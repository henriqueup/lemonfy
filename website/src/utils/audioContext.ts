import { setBarTimesInSeconds, type Bar, cropBar } from "@entities/bar";
import { type Note } from "@entities/note";
import { toPrecision } from "src/utils/numbers";

const addGainNode = (audioContext: AudioContext) => {
  const node = audioContext.createGain();
  node.connect(audioContext.destination);
  node.gain.setValueAtTime(0, audioContext.currentTime);

  return node;
};

const createBarCopy = (originalBar: Bar): Bar => {
  const newBar = JSON.parse(JSON.stringify(originalBar)) as Bar;
  return newBar;
};

const addNotesToAudioContext = (
  audioContext: AudioContext,
  notes: Note[],
  barStartInSeconds: number,
): AudioNode[] => {
  const audioNodes: AudioNode[] = [];
  for (let j = 0; j < notes.length; j++) {
    const note = notes[j];
    if (note === undefined) throw new Error(`Invalid note at index ${j}.`);

    if (note.startInSeconds == undefined)
      throw new Error(`Invalid note: '${j}', undefined startInSeconds.`);
    if (note.durationInSeconds == undefined)
      throw new Error(`Invalid note: '${j}', undefined durationInSeconds.`);

    const oscillator = audioContext.createOscillator();
    const gainNode = addGainNode(audioContext);
    const noteEndInSeconds = note.startInSeconds + note.durationInSeconds;
    const gainValueWhilePlaying = 0.2;

    gainNode.gain.setValueAtTime(
      gainValueWhilePlaying,
      toPrecision(
        audioContext.currentTime + barStartInSeconds + note.startInSeconds,
      ),
    );
    gainNode.gain.setValueAtTime(
      0,
      toPrecision(
        audioContext.currentTime + barStartInSeconds + noteEndInSeconds,
      ),
    );
    oscillator.connect(gainNode);

    //no clue wtf is going on here... gotta learn about sound wave synthesis, I guess
    const sineTerms = new Float32Array([1, 1, 1, 0, 1, 1, 0, 0, 1]);
    const cosineTerms = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1]);
    const customWaveform = audioContext.createPeriodicWave(
      cosineTerms,
      sineTerms,
    );

    oscillator.setPeriodicWave(customWaveform);
    oscillator.frequency.value = note.pitch.frequency;
    oscillator.start();

    audioNodes.push(gainNode);
    audioNodes.push(oscillator);
  }

  return audioNodes;
};

export const createBarAudioNodes = (
  bar: Bar | undefined,
  audioContext: AudioContext,
  startOffset: number,
  durationToCrop = 0,
): AudioNode[] => {
  if (!bar) return [];

  const barCopy = createBarCopy(bar);
  cropBar(barCopy, barCopy.start + durationToCrop);
  barCopy.start = startOffset;

  setBarTimesInSeconds(barCopy);
  if (barCopy.startInSeconds == undefined)
    throw new Error(`Invalid bar: undefined startInSeconds.`);

  const barNotes = barCopy.tracks.flat();
  return addNotesToAudioContext(audioContext, barNotes, barCopy.startInSeconds);
};
