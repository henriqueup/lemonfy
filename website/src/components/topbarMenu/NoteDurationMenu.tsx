import { type FunctionComponent } from "react";

import {
  MenubarItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/components/ui/menubar";
import {
  decreaseSelectedNoteDuration,
  increaseSelectedNoteDuration,
  setSelectedNoteDuration,
} from "@/store/editor/noteToAddActions";
import { useEditorStore } from "@/store/editor";
import { NOTE_DURATIONS, type NoteDurationName } from "@/server/entities/note";

const NoteDurationMenu: FunctionComponent<{ disabled?: boolean }> = ({
  disabled,
}) => {
  const selectedDuration = useEditorStore(state => state.selectedNoteDuration);

  return (
    <MenubarSub>
      <MenubarSubTrigger disabled={disabled}>Note Duration</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem inset keepOpen onClick={increaseSelectedNoteDuration}>
          Increase <MenubarShortcut>Alt↑</MenubarShortcut>
        </MenubarItem>
        <MenubarItem inset keepOpen onClick={decreaseSelectedNoteDuration}>
          Decrease <MenubarShortcut>Alt↓</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarRadioGroup value={selectedDuration}>
          {Object.keys(NOTE_DURATIONS).map(noteDuration => (
            <MenubarRadioItem
              key={`menu-${noteDuration}`}
              value={noteDuration}
              onClick={() =>
                setSelectedNoteDuration(noteDuration as NoteDurationName)
              }
            >
              {noteDuration}
            </MenubarRadioItem>
          ))}
        </MenubarRadioGroup>
      </MenubarSubContent>
    </MenubarSub>
  );
};

export default NoteDurationMenu;
