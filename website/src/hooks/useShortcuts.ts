import { useCallback, useEffect } from "react";

const SHORTCUTS = {
  CTRL_A: "bars.add",
  CTRL_N: "notes.add",
} as const;

type ShortcutKey = keyof typeof SHORTCUTS;
type ShortcutCode = (typeof SHORTCUTS)[ShortcutKey];

const isShortcutKey = (key: string): key is ShortcutKey => SHORTCUTS.hasOwnProperty(key);

type Shortcut = {
  code: ShortcutCode;
  key: ShortcutKey;
  callback: () => void;
};

type ShortcutDictionary = {
  [K in ShortcutKey]?: Shortcut;
};

const useShortcuts = (shortcutDictionary: ShortcutDictionary) => {
  const getShortcutKey = (event: KeyboardEvent): ShortcutKey | undefined => {
    const keyCodes: string[] = [];

    if (event.ctrlKey) keyCodes.push("CTRL");
    if (event.shiftKey) keyCodes.push("SHIFT");
    if (event.altKey) keyCodes.push("ALT");

    console.log(event.key);
    keyCodes.push(event.key);

    const resultingKeyCode = keyCodes.join("_");
    if (isShortcutKey(resultingKeyCode)) return resultingKeyCode;
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const shortcutKey = getShortcutKey(event);
      if (shortcutKey === undefined) return;

      const shortcut = shortcutDictionary[shortcutKey];
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
