import type { KeyboardEvent, SyntheticEvent } from "react";

export const handleKeyDown =
  <T>(key: string, callback: (event: SyntheticEvent<T>) => void) =>
  (event: KeyboardEvent<T>): void => {
    if (event.key === key) {
      callback(event);
    }
  };
