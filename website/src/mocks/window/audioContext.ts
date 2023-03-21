interface BaseAudioContext extends EventTarget {
  /** Available only in secure contexts. */
  readonly audioWorklet: AudioWorklet;
  readonly currentTime: number;
  readonly destination: AudioDestinationNode;
  readonly listener: AudioListener;
  onstatechange: ((this: BaseAudioContext, ev: Event) => any) | null;
  readonly sampleRate: number;
  readonly state: AudioContextState;
  createAnalyser(): AnalyserNode;
  createBiquadFilter(): BiquadFilterNode;
  createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;
  createBufferSource(): AudioBufferSourceNode;
  createChannelMerger(numberOfInputs?: number): ChannelMergerNode;
  createChannelSplitter(numberOfOutputs?: number): ChannelSplitterNode;
  createConstantSource(): ConstantSourceNode;
  createConvolver(): ConvolverNode;
  createDelay(maxDelayTime?: number): DelayNode;
  createDynamicsCompressor(): DynamicsCompressorNode;
  createGain(): GainNode;
  createIIRFilter(feedforward: number[], feedback: number[]): IIRFilterNode;
  createOscillator(): OscillatorNode;
  createPanner(): PannerNode;
  createPeriodicWave(
    real: number[] | Float32Array,
    imag: number[] | Float32Array,
    constraints?: PeriodicWaveConstraints,
  ): PeriodicWave;
  /** @deprecated */
  createScriptProcessor(
    bufferSize?: number,
    numberOfInputChannels?: number,
    numberOfOutputChannels?: number,
  ): ScriptProcessorNode;
  createStereoPanner(): StereoPannerNode;
  createWaveShaper(): WaveShaperNode;
  decodeAudioData(
    audioData: ArrayBuffer,
    successCallback?: DecodeSuccessCallback | null,
    errorCallback?: DecodeErrorCallback | null,
  ): Promise<AudioBuffer>;
  addEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

/** An audio-processing graph built from audio modules linked together, each represented by an AudioNode. */
interface AudioContext extends BaseAudioContext {
  readonly baseLatency: number;
  readonly outputLatency: number;
  close(): Promise<void>;
  createMediaElementSource(mediaElement: HTMLMediaElement): MediaElementAudioSourceNode;
  createMediaStreamDestination(): MediaStreamAudioDestinationNode;
  createMediaStreamSource(mediaStream: MediaStream): MediaStreamAudioSourceNode;
  getOutputTimestamp(): AudioTimestamp;
  resume(): Promise<void>;
  suspend(): Promise<void>;
  addEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: AudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof BaseAudioContextEventMap>(
    type: K,
    listener: (this: AudioContext, ev: BaseAudioContextEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

class AudioContext implements AudioContext {
  constructor() {
    return {
      baseLatency: 0,
      outputLatency: 0,
      close: jest.fn(),
      createBufferSource: jest.fn(() => ({} as AudioBufferSourceNode)),
      createMediaStreamSource: jest.fn(),
      createMediaElementSource: jest.fn(),
      createMediaStreamDestination: jest.fn(),
      getOutputTimestamp: jest.fn(),
      resume: jest.fn(),
      suspend: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      audioWorklet: {} as AudioWorklet,
      currentTime: 0,
      destination: {} as AudioDestinationNode,
      listener: {} as AudioListener,
      onstatechange: jest.fn(),
      sampleRate: 0,
      state: "running",
      createAnalyser: jest.fn(),
      createBiquadFilter: jest.fn(),
      createBuffer: jest.fn(),
      createChannelMerger: jest.fn(),
      createChannelSplitter: jest.fn(),
      createConstantSource: jest.fn(),
      createConvolver: jest.fn(),
      createDelay: jest.fn(),
      createDynamicsCompressor: jest.fn(),
      createGain: jest.fn(() => ({} as GainNode)),
      createIIRFilter: jest.fn(),
      createOscillator: jest.fn(),
      createPanner: jest.fn(),
      createPeriodicWave: jest.fn(),
      createScriptProcessor: jest.fn(),
      createStereoPanner: jest.fn(),
      createWaveShaper: jest.fn(),
      decodeAudioData: jest.fn(),
    };
  }
}

export default AudioContext;
