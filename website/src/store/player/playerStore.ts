import { create } from "zustand";

export interface PlayerStore {
  isPlaying: boolean;
  nextBarTimeout?: NodeJS.Timeout;
  currentBarIndex: number;
}

export const INITIAL_STATE: PlayerStore = {
  isPlaying: false,
  currentBarIndex: 0,
};

export const usePlayerStore = create<PlayerStore>(() => INITIAL_STATE);
