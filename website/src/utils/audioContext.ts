import BarModule, { type Bar } from "@entities/bar";
import { type Note } from "@entities/note";
import SheetModule, { type Sheet } from "@entities/sheet";
import { play } from "@/store/player/playerActions";
import { toPrecision } from "src/utils/numbers";

const addGainNode = (audioContext: AudioContext) => {
  const node = audioContext.createGain();
  node.connect(audioContext.destination);
  node.gain.setValueAtTime(0, audioContext.currentTime);

  return node;
};

const createSheetCopy = (originalSheet: Sheet): Sheet => {
  const newSheet = JSON.parse(JSON.stringify(originalSheet)) as Sheet;
  return newSheet;
};

const getBarsAfterStart = (sheet: Sheet, start: number): Bar[] => {
  const barsAfterStart = sheet.bars.filter(
    bar => bar.start > start || bar.start + bar.capacity > start,
  );
  const firstBar = barsAfterStart[0];

  if (firstBar !== undefined && firstBar.start < start)
    BarModule.cropBar(firstBar, start);

  return barsAfterStart;
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

export const playSong = (
  sheet: Sheet,
  audioContext: AudioContext,
  start = 0,
): void => {
  const sheetCopyForPlayback = createSheetCopy(sheet);
  SheetModule.fillBarsInSheet(sheetCopyForPlayback);

  const barsAfterStart = getBarsAfterStart(sheetCopyForPlayback, start);

  const audioNodes: AudioNode[] = [];
  for (let i = 0; i < barsAfterStart.length; i++) {
    const bar = barsAfterStart[i];
    if (bar === undefined) throw new Error(`Invalid bar at index ${i}.`);

    bar.start = Math.max(0, bar.start - start);
    BarModule.setBarTimesInSeconds(bar);
    if (bar.startInSeconds == undefined)
      throw new Error(`Invalid bar at ${i}: undefined startInSeconds.`);

    const barNotes = bar.tracks.flat();
    audioNodes.push(
      ...addNotesToAudioContext(audioContext, barNotes, bar.startInSeconds),
    );
  }

  play(audioNodes);
};
