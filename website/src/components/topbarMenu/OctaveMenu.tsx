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
} from "@/components/ui/Menubar";
import { NUMBER_OF_OCTAVES, type Octave } from "@/server/entities/octave";
import {
  decreaseSelectedOctave,
  increaseSelectedOctave,
  setSelectedOctave,
} from "@/store/editor/noteToAddActions";
import { useEditorStore } from "@/store/editor";

const OctaveMenu: FunctionComponent<{ disabled?: boolean }> = ({
  disabled,
}) => {
  const selectedOctave = useEditorStore(state => state.selectedOctave);

  return (
    <MenubarSub>
      <MenubarSubTrigger disabled={disabled}>Octave</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem inset keepOpen onClick={increaseSelectedOctave}>
          Increase <MenubarShortcut>⌘↑</MenubarShortcut>
        </MenubarItem>
        <MenubarItem inset keepOpen onClick={decreaseSelectedOctave}>
          Decrease <MenubarShortcut>⌘↓</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarRadioGroup value={selectedOctave.toString()}>
          {[...Array(NUMBER_OF_OCTAVES).keys()].map(octave => (
            <MenubarRadioItem
              key={`menu-${octave}`}
              value={octave.toString()}
              onClick={() => setSelectedOctave(octave as Octave)}
            >
              {octave}
            </MenubarRadioItem>
          ))}
        </MenubarRadioGroup>
      </MenubarSubContent>
    </MenubarSub>
  );
};

export default OctaveMenu;
