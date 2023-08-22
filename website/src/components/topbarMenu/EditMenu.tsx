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
} from "@/components/ui/Menubar";
import {
  useShortcuts,
  type ShortcutDictionary,
  DIGITS,
} from "@/hooks/useShortcuts";
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import { type PitchName, PITCH_NAMES } from "@entities/pitch";
import {
  decreaseSelectedNoteDuration,
  decreaseSelectedOctave,
  increaseSelectedNoteDuration,
  increaseSelectedOctave,
} from "@/store/editor/noteToAddActions";
import {
  addCopyOfCurrentBar,
  addNote,
  addNoteByFret,
  removeNextNoteFromBar,
} from "@/store/editor/sheetActions";
import OctaveMenu from "@/components/topbarMenu/OctaveMenu";
import NoteDurationMenu from "@/components/topbarMenu/NoteDurationMenu";

const getShortcutLabelFromPitchName = (pitchName: PitchName): string => {
  if (pitchName.length === 1) return pitchName;

  return `⇧${pitchName.charAt(0)}`;
};

const EditMenu: FunctionComponent = () => {
  const currentSheet = useEditorStore(getCurrentSheet);

  const notesDataByName = useMemo(
    () =>
      PITCH_NAMES.map(pitchName => ({
        callback: () => addNote(pitchName),
        label: pitchName,
        shortcutLabel: getShortcutLabelFromPitchName(pitchName),
        shortcutCode: `notes.add.${pitchName}` as const,
      })),
    [],
  );
  const notesDataByFret = useMemo(
    () =>
      DIGITS.map(fret => ({
        callback: () => addNoteByFret(fret),
        label: fret,
        shortcutCode: `notes.add.${fret}` as const,
      })),
    [],
  );

  useShortcuts({
    ...notesDataByName.reduce((shortcuts: ShortcutDictionary, noteData) => {
      shortcuts[noteData.shortcutCode] = {
        onKeyDown: noteData.callback,
      };

      return shortcuts;
    }, {}),
    ...notesDataByFret.reduce((shortcuts: ShortcutDictionary, noteData) => {
      shortcuts[noteData.shortcutCode] = {
        onKeyDown: noteData.callback,
      };

      return shortcuts;
    }, {}),
    "notes.add.4": {
      onKeyDown: () => addNoteByFret(4),
    },
    "octave.lower": {
      onKeyDown: decreaseSelectedOctave,
    },
    "octave.raise": {
      onKeyDown: increaseSelectedOctave,
    },
    "duration.lower": {
      onKeyDown: decreaseSelectedNoteDuration,
    },
    "duration.raise": {
      onKeyDown: increaseSelectedNoteDuration,
    },
    "notes.remove.previous": {
      onKeyDown: () => removeNextNoteFromBar(false),
    },
    "notes.remove.next": {
      onKeyDown: removeNextNoteFromBar,
    },
    "bars.add.copy": {
      onKeyDown: addCopyOfCurrentBar,
    },
  });

  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger disabled={currentSheet === undefined}>
            Add Note
          </MenubarSubTrigger>
          <MenubarSubContent>
            {notesDataByName.map(noteData => (
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
          <MenubarSubTrigger disabled={currentSheet === undefined}>
            Remove Note
          </MenubarSubTrigger>
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
        <OctaveMenu disabled={currentSheet === undefined} />
        <NoteDurationMenu disabled={currentSheet === undefined} />
      </MenubarContent>
    </MenubarMenu>
  );
};

export default EditMenu;
