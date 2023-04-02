import { useEditorStore } from "@store/editor";
import { pause } from "@store/player/playerActions";
import { type FunctionComponent } from "react";
import { ButtonContainer } from "src/components";
import { useAudioContext } from "src/hooks";
import { Play, Rewind, RewindFull, Stop, Wind, WindFull } from "src/icons";
import { playSong } from "src/utils/audioContext";

const PlaybackMenu: FunctionComponent = () => {
  const audioContext = useAudioContext();
  const currentSheet = useEditorStore(state => state.currentSheet);
  const cursor = useEditorStore(state => state.cursor);

  const handlePlay = () => {
    if (!audioContext) return;
    if (currentSheet === undefined) return;

    const barWithCursor = currentSheet.bars[cursor.barIndex];
    if (barWithCursor === undefined) throw new Error(`Invalid bar at ${cursor.barIndex}.`);

    playSong(currentSheet, audioContext, barWithCursor.start + cursor.position);
  };

  const handlePause = () => {
    pause();
  };

  return (
    <div className="absolute top-3 flex w-full justify-center">
      <div className="flex items-center rounded border border-solid border-gray-400 bg-black">
        <ButtonContainer className="w-1/6 p-2">
          <RewindFull stroke="lightgray" />
        </ButtonContainer>
        <ButtonContainer className="w-1/6 p-2">
          <Rewind stroke="lightgray" />
        </ButtonContainer>
        <ButtonContainer className="w-1/6 p-2" onClick={handlePlay}>
          <Play stroke="lightgray" />
        </ButtonContainer>
        <ButtonContainer className="w-1/6 p-2" onClick={handlePause}>
          <Stop stroke="lightgray" />
        </ButtonContainer>
        <ButtonContainer className="w-1/6 p-2">
          <Wind stroke="lightgray" />
        </ButtonContainer>
        <ButtonContainer className="w-1/6 p-2">
          <WindFull stroke="lightgray" />
        </ButtonContainer>
      </div>
    </div>
  );
};

export default PlaybackMenu;
