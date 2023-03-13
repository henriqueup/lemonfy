import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface PlayerStore {
  isPlaying: boolean;
  nextBarTimeout?: NodeJS.Timeout;
  currentBarIndex: number;
}

export const INITIAL_STATE: PlayerStore = {
  isPlaying: false,
  currentBarIndex: 0,
};

export const usePlayerStore = create<PlayerStore>()(devtools(() => INITIAL_STATE));
