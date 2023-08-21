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
import { useShortcuts, type ShortcutDictionary } from "@/hooks/useShortcuts";
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
  removeNextNoteFromBar,
} from "@/store/editor/sheetActions";
import OctaveMenu from "@/components/topbarMenu/OctaveMenu";
import NoteDurationMenu from "@/components/topbarMenu/NoteDurationMenu";

const EditMenu: FunctionComponent = () => {
  const currentSheet = useEditorStore(getCurrentSheet);

  const notesData = useMemo(
    () =>
      PITCH_NAMES.map(pitchName => ({
        callback: () => addNote(pitchName),
        label: pitchName,
        shortcutLabel: getShortcutLabelFromPitchName(pitchName),
        shortcutCode: `notes.add.${pitchName}` as const,
      })),
    [],
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

const getShortcutLabelFromPitchName = (pitchName: PitchName): string => {
  if (pitchName.length === 1) return pitchName;

  return `⇧${pitchName.charAt(0)}`;
};

export default EditMenu;
