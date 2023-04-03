import { useEditorStore } from "@store/editor";
import { usePlayerStore } from "@store/player";
import { pause, stop, windUp } from "@store/player/playerActions";
import { type FunctionComponent } from "react";
import { ButtonContainer } from "src/components";
import { useAudioContext } from "src/hooks";
import { Pause, Play, Rewind, RewindFull, Stop, WindUp, WindUpFull } from "src/icons";
import { playSong } from "src/utils/audioContext";

const PlaybackMenu: FunctionComponent = () => {
  const audioContext = useAudioContext();
  const currentSheet = useEditorStore(state => state.currentSheet);
  const cursor = useEditorStore(state => state.cursor);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const isPaused = usePlayerStore(state => state.isPaused);

  const handlePlay = () => {
    if (!audioContext || currentSheet === undefined || (isPlaying && !isPaused)) return;

    const barWithCursor = currentSheet.bars[cursor.barIndex];
    if (barWithCursor === undefined) throw new Error(`Invalid bar at ${cursor.barIndex}.`);

    playSong(currentSheet, audioContext, barWithCursor.start + cursor.position);
  };

  return (
    <div className="absolute top-3 flex w-full justify-center">
      <div className="flex items-center rounded border border-solid border-gray-400 bg-black">
        <ButtonContainer aria-label="Fully Rewind" className="w-1/6 p-2" onClick={() => windUp(true, true)}>
          <RewindFull stroke="lightgray" />
        </ButtonContainer>
        <ButtonContainer aria-label="Rewind" className="w-1/6 p-2" onClick={() => windUp(true)}>
          <Rewind stroke="lightgray" />
        </ButtonContainer>
        {!isPlaying || isPaused ? (
          <ButtonContainer aria-label="Play" className="w-1/6 p-2" onClick={handlePlay}>
            <Play stroke="lightgray" />
          </ButtonContainer>
        ) : (
          <ButtonContainer aria-label="Pause" className="w-1/6 p-2" onClick={pause}>
            <Pause stroke="lightgray" />
          </ButtonContainer>
        )}
        <ButtonContainer aria-label="Stop" className="w-1/6 p-2" onClick={stop}>
          <Stop stroke="lightgray" />
        </ButtonContainer>
        <ButtonContainer aria-label="Wind up" className="w-1/6 p-2" onClick={() => windUp()}>
          <WindUp stroke="lightgray" />
        </ButtonContainer>
        <ButtonContainer aria-label="Fully Wind up" className="w-1/6 p-2" onClick={() => windUp(false, true)}>
          <WindUpFull stroke="lightgray" />
        </ButtonContainer>
      </div>
    </div>
  );
};

export default PlaybackMenu;
