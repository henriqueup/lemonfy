import { type FunctionComponent } from "react";
import { SECONDS_PER_MINUTE } from "../../server/entities/bar";
import { useEditorStore } from "../../store/editor";

interface Props {
  position: number;
  barCapacity: number;
}

const Cursor: FunctionComponent<Props> = ({ position, barCapacity }) => {
  const currentSheet = useEditorStore(state => state.currentSheet);
  const cursorBarIndex = useEditorStore(state => state.cursor.barIndex);
  const barWithCursor = currentSheet?.bars[cursorBarIndex];

  if (currentSheet === undefined || barWithCursor === undefined) return null;

  return (
    <div
      style={{
        left: `calc(${(position * 100) / barCapacity}% - 4px)`,
        animation: `blink ${SECONDS_PER_MINUTE / barWithCursor.tempo}s step-start infinite`,
      }}
      className="absolute top-[-2px] flex h-[calc(100%_+_4px)] w-[9px]"
    >
      <div className="w-1/2 rounded-sm border-2 border-l-0 border-solid border-lime-600" />
      <div className="w-1/2 rounded-sm border-2 border-r-0 border-solid border-lime-600" />
    </div>
  );
};

export default Cursor;
