import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface GlobalStore {
  isLoading: boolean;
}

export const INITIAL_STATE: GlobalStore = {
  isLoading: false,
};

export const useGlobalStore = create<GlobalStore>()(
  devtools(() => INITIAL_STATE),
);
