import { useToast } from "@/hooks/useToast";
import { BusinessException } from "@/utils/exceptions";
import { useCallback, useEffect } from "react";
import { ZodError } from "zod";

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
  SHIFT_ArrowRight: "cursor.position.right.skip",
  SHIFT_ArrowLeft: "cursor.position.left.skip",
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
  SHIFT_0: "type.fret.0",
  SHIFT_1: "type.fret.1",
  SHIFT_2: "type.fret.2",
  SHIFT_3: "type.fret.3",
  SHIFT_4: "type.fret.4",
  SHIFT_5: "type.fret.5",
  SHIFT_6: "type.fret.6",
  SHIFT_7: "type.fret.7",
  SHIFT_8: "type.fret.8",
  SHIFT_9: "type.fret.9",
  Shift: "release.shift",
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
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof BusinessException) {
        toast({ variant: "destructive", title: error.message });
        return;
      }

      if (error instanceof ZodError) {
        const errorMessages = error.flatten().formErrors;

        errorMessages.forEach(errorMessage =>
          toast({ variant: "destructive", title: errorMessage }),
        );
        return;
      }

      throw error;
    },
    [toast],
  );

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
      // console.log(resultingKey);
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

      try {
        shortcut.onKeyDown();
      } catch (error) {
        handleError(error);
      }
    },
    [getShortcut, handleError],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const shortcut = getShortcut(event);
      if (!shortcut?.onKeyUp) return;

      event.preventDefault();

      try {
        shortcut.onKeyUp();
      } catch (error) {
        handleError(error);
      }
    },
    [getShortcut, handleError],
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
