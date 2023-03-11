import type { Sheet } from "@entities/sheet";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface PlayerStore {
  sheet: Sheet;
  isPlaying: boolean;
  nextBarTimeout?: NodeJS.Timeout;
  currentBarIndex: number;
}

export const INITIAL_STATE: PlayerStore = {
  sheet: { tracks: [], trackCount: 0, bars: [] },
  isPlaying: false,
  currentBarIndex: 0,
};

export const usePlayerStore = create<PlayerStore>()(devtools(() => INITIAL_STATE));
