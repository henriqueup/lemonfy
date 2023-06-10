import { type FunctionComponent } from "react";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import { useShortcuts } from "@/hooks";

const CursorMenu: FunctionComponent = () => {
  const currentSheet = useEditorStore(getCurrentSheet);

  useShortcuts({
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

  const disableCursorActions =
    currentSheet === undefined || currentSheet.bars.length === 0;

  return (
    <MenubarMenu>
      <MenubarTrigger>Cursor</MenubarTrigger>
      <MenubarContent>
        <MenubarItem
          disabled={disableCursorActions}
          keepOpen
          onClick={decreaseCursorPosition}
        >
          Previous Note
          <MenubarShortcut>🠜</MenubarShortcut>
        </MenubarItem>
        <MenubarItem
          disabled={disableCursorActions}
          keepOpen
          onClick={increaseCursorPosition}
        >
          Next Note
          <MenubarShortcut>🠞</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem
          disabled={disableCursorActions}
          keepOpen
          onClick={decreaseCursorTrackIndex}
        >
          Previous Track
          <MenubarShortcut>🠝</MenubarShortcut>
        </MenubarItem>
        <MenubarItem
          disabled={disableCursorActions}
          keepOpen
          onClick={increaseCursorTrackIndex}
        >
          Next Track
          <MenubarShortcut>🠟</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem
          disabled={disableCursorActions}
          keepOpen
          onClick={decreaseCursorBarIndex}
        >
          Previous Bar
          <MenubarShortcut>⌘🠜</MenubarShortcut>
        </MenubarItem>
        <MenubarItem
          disabled={disableCursorActions}
          keepOpen
          onClick={increaseCursorBarIndex}
        >
          Next Bar
          <MenubarShortcut>⌘🠞</MenubarShortcut>
        </MenubarItem>
        <MenubarItem
          disabled={disableCursorActions}
          keepOpen
          onClick={moveCursorToStartOfBar}
        >
          Start of Bar
          <MenubarShortcut>⌘⇧🠜</MenubarShortcut>
        </MenubarItem>
        <MenubarItem
          disabled={disableCursorActions}
          keepOpen
          onClick={moveCursorToEndOfBar}
        >
          End of Bar
          <MenubarShortcut>⌘⇧🠞</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

export default CursorMenu;
