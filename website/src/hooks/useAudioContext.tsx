import { useEffect, useState } from "react";

function useAudioContext() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    setAudioContext(new AudioContext());

    return () => {
      void audioContext?.close();
    };
  }, []);

  return audioContext;
}

export { useAudioContext };
