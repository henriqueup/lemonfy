import { useCallback, useEffect } from "react";

const SHORTCUTS = {
  ArrowRight: "duration.raise",
  ArrowLeft: "duration.lower",
  ArrowUp: "octave.raise",
  ArrowDown: "octave.lower",
  CTRL_ArrowUp: "cursor.track.above",
  CTRL_ArrowDown: "cursor.track.under",
  CTRL_ArrowRight: "cursor.bar.right",
  CTRL_ArrowLeft: "cursor.bar.left",
  SHIFT_ArrowRight: "cursor.position.right",
  SHIFT_ArrowLeft: "cursor.position.left",
  CTRL_SHIFT_ArrowRight: "cursor.position.endOfBar",
  CTRL_SHIFT_ArrowLeft: "cursor.position.startOfBar",
  c: "notes.add.C",
  SHIFT_C: "notes.add.C#",
  d: "notes.add.D",
  SHIFT_D: "notes.add.D#",
  e: "notes.add.E",
  F: "notes.add.F",
  SHIFT_F: "notes.add.F#",
  g: "notes.add.G",
  SHIFT_G: "notes.add.G#",
  a: "notes.add.A",
  SHIFT_A: "notes.add.A#",
  b: "notes.add.B",
  Backspace: "notes.remove.left",
  Delete: "notes.remove.right",
} as const;

type ShortcutKey = keyof typeof SHORTCUTS;
type ShortcutCode = (typeof SHORTCUTS)[ShortcutKey];

const isShortcutKey = (key: string): key is ShortcutKey => SHORTCUTS.hasOwnProperty(key);

type Shortcut = {
  callback: () => void;
};

type ShortcutDictionary = {
  [K in ShortcutCode]?: Shortcut;
};

const useShortcuts = (shortcutDictionary: ShortcutDictionary) => {
  const getShortcutKey = (event: KeyboardEvent): ShortcutKey | undefined => {
    const keys: string[] = [];

    if (event.ctrlKey) keys.push("CTRL");
    if (event.shiftKey) keys.push("SHIFT");
    if (event.altKey) keys.push("ALT");

    console.log(event.key);
    keys.push(event.key);

    const resultingKey = keys.join("_");
    if (isShortcutKey(resultingKey)) return resultingKey;
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;

      const shortcutKey = getShortcutKey(event);
      if (shortcutKey === undefined) return;

      const shortcutCode = SHORTCUTS[shortcutKey];
      const shortcut = shortcutDictionary[shortcutCode];
      if (shortcut === undefined) return;

      event.preventDefault();
      shortcut.callback();
    },
    [shortcutDictionary],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};

export { useShortcuts };
