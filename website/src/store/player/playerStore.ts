import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Cursor {
  barIndex: number;
  position: number;
}

export interface PlayerStore {
  isPlaying: boolean;
  currentTimeoutStartTime?: Date;
  nextBarTimeout?: NodeJS.Timeout;
  cursor: Cursor;
}

export const INITIAL_STATE: PlayerStore = {
  isPlaying: false,
  cursor: {
    barIndex: 0,
    position: 0,
  },
};

export const usePlayerStore = create<PlayerStore>()(devtools(() => INITIAL_STATE));
