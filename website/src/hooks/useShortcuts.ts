import { useCallback, useEffect } from "react";

export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const SHORTCUTS = {
  ALT_ArrowUp: "duration.raise",
  ALT_ArrowDown: "duration.lower",
  CTRL_ArrowUp: "octave.raise",
  CTRL_ArrowDown: "octave.lower",
  ArrowUp: "cursor.track.above",
  ArrowDown: "cursor.track.under",
  CTRL_ArrowRight: "cursor.bar.right",
  CTRL_ArrowLeft: "cursor.bar.left",
  ArrowRight: "cursor.position.right",
  ArrowLeft: "cursor.position.left",
  CTRL_SHIFT_ArrowRight: "cursor.position.endOfBar",
  CTRL_SHIFT_ArrowLeft: "cursor.position.startOfBar",
  c: "notes.add.C",
  SHIFT_C: "notes.add.C#",
  d: "notes.add.D",
  SHIFT_D: "notes.add.D#",
  e: "notes.add.E",
  f: "notes.add.F",
  SHIFT_F: "notes.add.F#",
  g: "notes.add.G",
  SHIFT_G: "notes.add.G#",
  a: "notes.add.A",
  SHIFT_A: "notes.add.A#",
  b: "notes.add.B",
  x: "notes.add.X",
  Backspace: "notes.remove.previous",
  Delete: "notes.remove.next",
  CTRL_b: "bars.add.copy",
  CTRL_s: "save.song",
  CTRL_SHIFT_S: "new.song",
  CTRL_z: "undo",
  CTRL_SHIFT_Z: "redo",
  "0": "notes.add.0",
  "1": "notes.add.1",
  "2": "notes.add.2",
  "3": "notes.add.3",
  "4": "notes.add.4",
  "5": "notes.add.5",
  "6": "notes.add.6",
  "7": "notes.add.7",
  "8": "notes.add.8",
  "9": "notes.add.9",
} as const;

type ShortcutKey = keyof typeof SHORTCUTS;
type ShortcutCode = (typeof SHORTCUTS)[ShortcutKey];

const isShortcutKey = (key: string): key is ShortcutKey =>
  SHORTCUTS.hasOwnProperty(key);

type Shortcut = {
  onKeyDown?: () => void;
  onKeyUp?: () => void;
};

export type ShortcutDictionary = {
  [K in ShortcutCode]?: Shortcut;
};

const useShortcuts = (shortcutDictionary: ShortcutDictionary) => {
  const handleDigit = useCallback((event: KeyboardEvent): string => {
    const digitPrefix = "Digit";

    if (event.code.startsWith(digitPrefix)) {
      return event.code.substring(digitPrefix.length);
    }

    return event.key;
  }, []);

  const getShortcutKey = useCallback(
    (event: KeyboardEvent): ShortcutKey | undefined => {
      const keys: string[] = [];

      if (event.ctrlKey) keys.push("CTRL");
      if (event.shiftKey) keys.push("SHIFT");
      if (event.altKey) keys.push("ALT");

      keys.push(handleDigit(event));

      const resultingKey = keys.join("_");
      console.log(resultingKey);
      if (isShortcutKey(resultingKey)) return resultingKey;
    },
    [handleDigit],
  );

  const getRoleFromEventTarget = useCallback(
    (eventTarget: HTMLElement): string | null => {
      const roleAttribute = eventTarget.attributes.getNamedItem("role");
      if (roleAttribute === null) return null;

      return roleAttribute.value;
    },
    [],
  );

  const getShortcut = useCallback(
    (event: KeyboardEvent): Shortcut | undefined => {
      if (
        !(event.target instanceof HTMLElement) ||
        event.target instanceof HTMLInputElement
      ) {
        return;
      }

      const targetRole = getRoleFromEventTarget(event.target);
      if (targetRole?.startsWith("menu")) return;

      const shortcutKey = getShortcutKey(event);
      if (shortcutKey === undefined) return;

      const shortcutCode = SHORTCUTS[shortcutKey];
      return shortcutDictionary[shortcutCode];
    },
    [getRoleFromEventTarget, getShortcutKey, shortcutDictionary],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const shortcut = getShortcut(event);
      if (!shortcut?.onKeyDown) return;

      event.preventDefault();
      shortcut.onKeyDown();
    },
    [getShortcut],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const shortcut = getShortcut(event);
      if (!shortcut?.onKeyUp) return;

      event.preventDefault();
      shortcut.onKeyUp();
    },
    [getShortcut],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};

export { useShortcuts };
