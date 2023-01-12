import { createGainNode } from "@lemonfy/functions";
import { useAudioContext } from "@lemonfy/hooks";
import type { NextPage } from "next";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { Button } from "../../components/button";
import styles from "../../styles/root.module.css";

enum mouseEvents {
  MOUSE_LEFT = 1,
}

const Notes: NextPage = () => {
  const audioContext = useAudioContext();
  const [gainVolume, setGainVolume] = useState<number>(0.5);
  const [oscillators, setOscillators] = useState<Oscillator[] | null>(null);
  const currentTime = useMemo(() => (audioContext ? audioContext.currentTime : 0), [audioContext]);

  const createOscillators = useCallback(() => {
    if (!audioContext) return null;

    const oscillators: Oscillator[] = [];
    notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = createGainNode(audioContext);
      oscillator.connect(gainNode);

      //no clue wtf is going on here... gotta learn about sound wave synthesis, I guess
      const sineTerms = new Float32Array([1, 1, 1, 0, 1, 1, 0, 0, 1]);
      const cosineTerms = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1]);
      const customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

      oscillator.setPeriodicWave(customWaveform);
      oscillator.frequency.value = note.frequency;
      oscillator.start();

      oscillators.push({
        id: note.id,
        node: oscillator,
        gainNode: gainNode,
        playing: false,
      });
    });

    return oscillators;
  }, [audioContext, createGainNode]);

  const playNote = (event: MouseEvent, noteId: string) => {
    if (event.buttons !== mouseEvents.MOUSE_LEFT) return;
    let newOscillators = oscillators;

    //trigger creation from user gesture
    if (!oscillators) {
      newOscillators = createOscillators();
      setOscillators(newOscillators);
    }

    const oscillator = newOscillators?.find(oscillator => oscillator.id === noteId);
    if (!oscillator) return;

    oscillator.gainNode.gain.setValueAtTime(gainVolume, currentTime + SMOOTHING_INTERVAL);
    oscillator.playing = true;
  };

  const stopNote = (noteId: string) => {
    if (!oscillators) return;

    const oscillator = oscillators.find(oscillator => oscillator.id === noteId);
    if (!oscillator) return;

    oscillator.gainNode.gain.setValueAtTime(0, currentTime + SMOOTHING_INTERVAL);
    oscillator.playing = false;
  };

  return (
    <div className={styles.container}>
      <div>
        {notes.map(note => (
          <Button
            text={note.id}
            variant="success"
            onMouseDown={event => playNote(event, note.id)}
            onMouseEnter={event => playNote(event, note.id)}
            onMouseUp={() => stopNote(note.id)}
            onMouseLeave={() => stopNote(note.id)}
            key={note.id}
          />
        ))}
      </div>
      <div>
        <label htmlFor="gainVol">Gain Volume:</label>
        <input
          type="range"
          id="gainVol"
          name="gainVol"
          min="0"
          max="100"
          onChange={e => {
            setGainVolume(Number(e.target.value) / 100);
            console.log(gainVolume);
          }}
        />
      </div>
    </div>
  );
};

const SMOOTHING_INTERVAL = 0.02;

type Oscillator = {
  id: string;
  node: OscillatorNode;
  gainNode: GainNode;
  playing: boolean;
};

type Note = {
  id: string;
  frequency: number;
};

const notes: Note[] = [
  {
    id: "C3",
    frequency: 130.81,
  },
  {
    id: "C#3",
    frequency: 138.59,
  },
  {
    id: "D3",
    frequency: 146.83,
  },
  {
    id: "D#3",
    frequency: 155.56,
  },
  {
    id: "E3",
    frequency: 164.81,
  },
  {
    id: "F3",
    frequency: 174.61,
  },
  {
    id: "F#3",
    frequency: 185,
  },
  {
    id: "G3",
    frequency: 196,
  },
  {
    id: "G#3",
    frequency: 207.65,
  },
  {
    id: "A3",
    frequency: 220,
  },
  {
    id: "A#3",
    frequency: 233.08,
  },
  {
    id: "B3",
    frequency: 246.94,
  },
];

export default Notes;
