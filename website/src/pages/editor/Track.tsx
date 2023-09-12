import React, { type FunctionComponent } from "react";

import { type Bar } from "@entities/bar";
import { type Note as NoteEntity } from "@entities/note";
import { getCurrentInstrument, useEditorStore } from "@/store/editor";
import Cursor from "./Cursor";
import Note from "./Note";
import { usePlayerStore } from "@/store/player";
import { getFretFromNote } from "@/server/entities/instrument";

interface TrackProps {
  index: number;
  bar: Bar;
  track: NoteEntity[];
  displayByFret?: boolean;
}

const Track: FunctionComponent<TrackProps> = ({
  index,
  bar,
  track,
  displayByFret,
}) => {
  const instrument = getCurrentInstrument();
  const cursor = useEditorStore(state => state.cursor);
  const isPlaying = usePlayerStore(state => state.isPlaying);

  const isSelectedTrack = index === cursor.trackIndex;
  const isSelectedBar = bar.index === cursor.barIndex;

  return (
    <div className="mb-0.5 mt-0.5 flex h-full w-full">
      <div className="relative flex w-full">
        {track.map((note, i) => (
          <Note
            key={i}
            note={note}
            bar={bar}
            fret={
              displayByFret && instrument
                ? getFretFromNote(instrument, index, note)
                : undefined
            }
          />
        ))}
        <div className="m-auto ml-0 mr-0 h-px flex-grow border" />
        {!isPlaying && isSelectedTrack && isSelectedBar ? (
          <Cursor bar={bar} isPlaying={isPlaying} position={cursor.position} />
        ) : null}
      </div>
    </div>
  );
};

export default Track;
