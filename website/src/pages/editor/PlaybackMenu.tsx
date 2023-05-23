import { type FunctionComponent } from "react";

import { getCurrentSheet, useEditorStore } from "@store/editor";
import { usePlayerStore } from "@store/player";
import { pause, stop, windUp } from "@store/player/playerActions";
import { ButtonContainer } from "src/components";
import { useAudioContext } from "src/hooks";
import {
  Pause,
  Play,
  Rewind,
  RewindFull,
  Stop,
  WindUp,
  WindUpFull,
} from "src/icons";
import { playSong } from "src/utils/audioContext";

const PlaybackMenu: FunctionComponent = () => {
  const audioContext = useAudioContext();
  const currentSheet = getCurrentSheet();
  const cursor = useEditorStore(state => state.cursor);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const isPaused = usePlayerStore(state => state.isPaused);

  const handlePlay = () => {
    if (!audioContext || currentSheet === undefined || (isPlaying && !isPaused))
      return;

    const barWithCursor = currentSheet.bars[cursor.barIndex];
    if (barWithCursor === undefined)
      throw new Error(`Invalid bar at ${cursor.barIndex}.`);

    playSong(currentSheet, audioContext, barWithCursor.start + cursor.position);
  };

  return (
    <div className="absolute left-0 top-[-4px] flex w-full justify-center bg-transparent">
      <div className="flex items-center rounded border border-solid border-stone-600 bg-stone-300 dark:border-stone-400 dark:bg-stone-900">
        <ButtonContainer
          aria-label="Fully Rewind"
          className="w-1/6 p-2"
          onClick={() => windUp(true, true)}
        >
          <RewindFull />
        </ButtonContainer>
        <ButtonContainer
          aria-label="Rewind"
          className="w-1/6 p-2"
          onClick={() => windUp(true)}
        >
          <Rewind />
        </ButtonContainer>
        {!isPlaying || isPaused ? (
          <ButtonContainer
            aria-label="Play"
            className="w-1/6 p-2"
            onClick={handlePlay}
          >
            <Play />
          </ButtonContainer>
        ) : (
          <ButtonContainer
            aria-label="Pause"
            className="w-1/6 p-2"
            onClick={pause}
          >
            <Pause />
          </ButtonContainer>
        )}
        <ButtonContainer aria-label="Stop" className="w-1/6 p-2" onClick={stop}>
          <Stop />
        </ButtonContainer>
        <ButtonContainer
          aria-label="Wind up"
          className="w-1/6 p-2"
          onClick={() => windUp()}
        >
          <WindUp />
        </ButtonContainer>
        <ButtonContainer
          aria-label="Fully Wind up"
          className="w-1/6 p-2"
          onClick={() => windUp(false, true)}
        >
          <WindUpFull />
        </ButtonContainer>
      </div>
    </div>
  );
};

export default PlaybackMenu;
