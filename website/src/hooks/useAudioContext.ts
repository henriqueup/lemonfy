import { useEffect, useState } from "react";

const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    setAudioContext(new AudioContext());
  }, []);

  useEffect(() => {
    return () => {
      if (!audioContext) return;

      if (audioContext.state !== "closed") void audioContext.close();
    };
  }, [audioContext]);

  return audioContext;
};

export { useAudioContext };
