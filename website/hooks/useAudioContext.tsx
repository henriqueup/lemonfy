import { useEffect, useState } from "react";

function useAudioContext() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    setAudioContext(new AudioContext());

    return () => {
      audioContext?.close();
    };
  }, []);

  return audioContext;
}

export { useAudioContext };
