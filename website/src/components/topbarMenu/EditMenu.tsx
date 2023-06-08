import { useMemo, type FunctionComponent } from "react";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useShortcuts, type ShortcutDictionary } from "@/hooks/useShortcuts";
import { useEditorStore } from "@/store/editor";
import { type PitchName, PITCH_NAMES } from "@entities/pitch";
import { NOTE_DURATIONS } from "@entities/note";
import {
  decreaseSelectedNoteDuration,
  decreaseSelectedOctave,
  increaseSelectedNoteDuration,
  increaseSelectedOctave,
} from "@/store/editor/noteToAddActions";
import {
  addCopyOfCurrentBar,
  addNote,
  removeNextNoteFromBar,
} from "@/store/editor/sheetActions";
import {
  decreaseCursorBarIndex,
  decreaseCursorPosition,
  decreaseCursorTrackIndex,
  increaseCursorBarIndex,
  increaseCursorPosition,
  increaseCursorTrackIndex,
  moveCursorToEndOfBar,
  moveCursorToStartOfBar,
} from "@/store/editor/cursorActions";
import OctaveMenu from "@/components/topbarMenu/OctaveMenu";
import NoteDurationMenu from "@/components/topbarMenu/NoteDurationMenu";

const EditMenu: FunctionComponent = () => {
  const selectedOctave = useEditorStore(state => state.selectedOctave);
  const selectedDuration = useEditorStore(state => state.selectedNoteDuration);

  const notesData = useMemo(
    () =>
      PITCH_NAMES.map(pitchName => ({
        callback: () =>
          addNote(NOTE_DURATIONS[selectedDuration], pitchName, selectedOctave),
        label: pitchName,
        shortcutLabel: getShortcutLabelFromPitchName(pitchName),
        shortcutCode: `notes.add.${pitchName}` as const,
      })),
    [selectedDuration, selectedOctave],
  );

  useShortcuts({
    ...notesData.reduce((shortcuts: ShortcutDictionary, noteData) => {
      shortcuts[noteData.shortcutCode] = {
        callback: noteData.callback,
      };

      return shortcuts;
    }, {}),
    "octave.lower": {
      callback: decreaseSelectedOctave,
    },
    "octave.raise": {
      callback: increaseSelectedOctave,
    },
    "duration.lower": {
      callback: decreaseSelectedNoteDuration,
    },
    "duration.raise": {
      callback: increaseSelectedNoteDuration,
    },
    "notes.remove.previous": {
      callback: () => removeNextNoteFromBar(false),
    },
    "notes.remove.next": {
      callback: removeNextNoteFromBar,
    },
    "bars.add.copy": {
      callback: addCopyOfCurrentBar,
    },
    "cursor.track.above": {
      callback: decreaseCursorTrackIndex,
    },
    "cursor.track.under": {
      callback: increaseCursorTrackIndex,
    },
    "cursor.bar.left": {
      callback: decreaseCursorBarIndex,
    },
    "cursor.bar.right": {
      callback: increaseCursorBarIndex,
    },
    "cursor.position.left": {
      callback: decreaseCursorPosition,
    },
    "cursor.position.right": {
      callback: increaseCursorPosition,
    },
    "cursor.position.startOfBar": {
      callback: moveCursorToStartOfBar,
    },
    "cursor.position.endOfBar": {
      callback: moveCursorToEndOfBar,
    },
  });

  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>Add Note</MenubarSubTrigger>
          <MenubarSubContent>
            {notesData.map(noteData => (
              <MenubarItem
                key={`menu-${noteData.label}`}
                keepOpen
                onClick={noteData.callback}
              >
                {noteData.label}
                <MenubarShortcut>{noteData.shortcutLabel}</MenubarShortcut>
              </MenubarItem>
            ))}
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSub>
          <MenubarSubTrigger>Remove Note</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem keepOpen onClick={() => removeNextNoteFromBar(false)}>
              Previous
              <MenubarShortcut>←</MenubarShortcut>
            </MenubarItem>
            <MenubarItem keepOpen onClick={() => removeNextNoteFromBar()}>
              Next
              <MenubarShortcut>Del</MenubarShortcut>
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <OctaveMenu />
        <NoteDurationMenu />
      </MenubarContent>
    </MenubarMenu>
  );
};

const getShortcutLabelFromPitchName = (pitchName: PitchName): string => {
  if (pitchName.length === 1) return pitchName;

  return `⇧${pitchName.charAt(0)}`;
};

export default EditMenu;
