import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Cursor {
  barIndex: number;
  position: number;
}

export interface PlayerStore {
  isPlaying: boolean;
  isPaused: boolean;
  currentTimeoutStartTime?: Date;
  nextBarTimeout?: NodeJS.Timeout;
  cursor: Cursor;
  gainNodes: GainNode[];
  oscillatorNodes: OscillatorNode[];
}

export const INITIAL_STATE: PlayerStore = {
  isPlaying: false,
  isPaused: false,
  cursor: {
    barIndex: 0,
    position: 0,
  },
  gainNodes: [],
  oscillatorNodes: [],
};

export const usePlayerStore = create<PlayerStore>()(devtools(() => INITIAL_STATE));
