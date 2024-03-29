import { useState, type FunctionComponent } from "react";

import { usePlayerStore } from "@/store/player";
import { pause, play, stop, windUp } from "@/store/player/playerActions";
import { ButtonContainer } from "src/components";
import {
  Pause,
  Play,
  Rewind,
  RewindFull,
  Stop,
  WindUp,
  WindUpFull,
} from "src/icons";

const PlaybackMenu: FunctionComponent = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const isPaused = usePlayerStore(state => state.isPaused);

  const handlePlay = () => {
    void audioContext?.close();
    const newAudioContext = new AudioContext();

    setAudioContext(newAudioContext);
    play(newAudioContext);
  };

  return (
    <div className="pointer-events-none absolute left-0 top-[40px] flex w-full justify-center bg-transparent">
      <div className="pointer-events-auto flex items-center rounded border bg-background">
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
