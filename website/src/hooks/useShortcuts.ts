import { useCallback, useEffect } from "react";

const SHORTCUTS = {
  CTRL_A: "bars.add",
  CTRL_N: "notes.add",
  ArrowRight: "duration.raise",
  ArrowLeft: "duration.lower",
  ArrowUp: "octave.raise",
  ArrowDown: "octave.lower",
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
