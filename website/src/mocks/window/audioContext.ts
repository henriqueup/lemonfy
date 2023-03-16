class AudioContext {
  baseLatency!: number;
  outputLatency!: number;
  close!: () => Promise<void>;
  createBufferSource!: () => AudioBufferSourceNode;

  constructor(contextOptions?: AudioContextOptions | undefined) {
    return {
      baseLatency: 0,
      outputLatency: 0,
      close: jest.fn(),
      createBufferSource: jest.fn(),
    };
  }
}

export default AudioContext;
