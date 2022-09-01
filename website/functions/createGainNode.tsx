export const createGainNode = (audioContext: AudioContext) => {
  const node = audioContext.createGain();
  node.connect(audioContext.destination);
  node.gain.setValueAtTime(0, audioContext.currentTime);

  return node;
};
