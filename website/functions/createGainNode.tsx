export const createGainNode = (audioContext: AudioContext | null) => {
  if (!audioContext) return null;

  const node = audioContext.createGain();
  node.connect(audioContext.destination);
  node.gain.setValueAtTime(0, audioContext.currentTime);

  return node;
};
