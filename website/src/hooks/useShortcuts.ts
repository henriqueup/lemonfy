import { useCallback, useEffect } from "react";

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
} as const;

type ShortcutKey = keyof typeof SHORTCUTS;
type ShortcutCode = (typeof SHORTCUTS)[ShortcutKey];

const isShortcutKey = (key: string): key is ShortcutKey =>
  SHORTCUTS.hasOwnProperty(key);

type Shortcut = {
  callback: () => void;
};

export type ShortcutDictionary = {
  [K in ShortcutCode]?: Shortcut;
};

const useShortcuts = (shortcutDictionary: ShortcutDictionary) => {
  const getShortcutKey = (event: KeyboardEvent): ShortcutKey | undefined => {
    const keys: string[] = [];

    if (event.ctrlKey) keys.push("CTRL");
    if (event.shiftKey) keys.push("SHIFT");
    if (event.altKey) keys.push("ALT");

    keys.push(event.key);

    const resultingKey = keys.join("_");
    // console.log(resultingKey);
    if (isShortcutKey(resultingKey)) return resultingKey;
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
      const shortcut = shortcutDictionary[shortcutCode];
      if (shortcut === undefined) return;

      event.preventDefault();
      shortcut.callback();
    },
    [shortcutDictionary],
  );

  const getRoleFromEventTarget = (eventTarget: HTMLElement): string | null => {
    const roleAttribute = eventTarget.attributes.getNamedItem("role");
    if (roleAttribute === null) return null;

    return roleAttribute.value;
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};

export { useShortcuts };
