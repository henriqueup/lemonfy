/** A mocked implementation of the Web Audio API's AudioParam defined internally and used for tests. */
interface AudioParam {
  automationRate: AutomationRate;
  readonly defaultValue: number;
  readonly maxValue: number;
  readonly minValue: number;
  value: number;
  cancelAndHoldAtTime(cancelTime: number): AudioParam;
  cancelScheduledValues(cancelTime: number): AudioParam;
  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam;
  linearRampToValueAtTime(value: number, endTime: number): AudioParam;
  setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam;
  setValueAtTime(value: number, startTime: number): AudioParam;
  setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): AudioParam;
}

/** A mocked implementation of the Web Audio API's AudioNode defined internally and used for tests. */
interface AudioNode extends EventTarget {
  channelCount: number;
  channelCountMode: ChannelCountMode;
  channelInterpretation: ChannelInterpretation;
  readonly context: BaseAudioContext;
  readonly numberOfInputs: number;
  readonly numberOfOutputs: number;
  connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode;
  connect(destinationParam: AudioParam, output?: number): void;
  disconnect(): void;
  disconnect(output: number): void;
  disconnect(destinationNode: AudioNode): void;
  disconnect(destinationNode: AudioNode, output: number): void;
  disconnect(destinationNode: AudioNode, output: number, input: number): void;
  disconnect(destinationParam: AudioParam): void;
  disconnect(destinationParam: AudioParam, output: number): void;
}

interface AudioScheduledSourceNode extends AudioNode {
  onended: ((this: AudioScheduledSourceNode, ev: Event) => any) | null;
  start(when?: number): void;
  stop(when?: number): void;
  addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: AudioScheduledSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: AudioScheduledSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

/** A mocked implementation of the Web Audio API's GainNode defined internally and used for tests. */
interface GainNode extends AudioNode {
  readonly gain: AudioParam;
}

/** A mocked implementation of the Web Audio API's OscillatorNode defined internally and used for tests. */
interface OscillatorNode extends AudioScheduledSourceNode {
  readonly detune: AudioParam;
  readonly frequency: AudioParam;
  type: OscillatorType;
  setPeriodicWave(periodicWave: PeriodicWave): void;
  addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: OscillatorNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(
    type: K,
    listener: (this: OscillatorNode, ev: AudioScheduledSourceNodeEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

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

/** A mocked implementation of the Web Audio API's AudioContext defined internally and used for tests. */
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

class AudioParam implements AudioParam {
  constructor() {
    return {
      automationRate: "a-rate",
      defaultValue: 0,
      maxValue: 0,
      minValue: 0,
      value: 0,
      cancelAndHoldAtTime: jest.fn(),
      cancelScheduledValues: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
      linearRampToValueAtTime: jest.fn(),
      setTargetAtTime: jest.fn(),
      setValueAtTime: jest.fn(),
      setValueCurveAtTime: jest.fn(),
    };
  }
}

class AudioNode implements AudioNode {
  constructor() {
    return {
      channelCount: 0,
      channelCountMode: "max",
      channelInterpretation: "discrete",
      context: {} as BaseAudioContext,
      numberOfInputs: 0,
      numberOfOutputs: 0,
      connect: jest.fn(),
      disconnect: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  }
}

class GainNode implements GainNode {
  constructor() {
    return {
      gain: new AudioParam(),
      channelCount: 0,
      channelCountMode: {} as ChannelCountMode,
      channelInterpretation: {} as ChannelInterpretation,
      context: {} as BaseAudioContext,
      numberOfInputs: 0,
      numberOfOutputs: 0,
      connect: jest.fn(),
      disconnect: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  }
}

class OscillatorNode implements OscillatorNode {
  constructor() {
    return {
      detune: new AudioParam(),
      frequency: new AudioParam(),
      type: "sine",
      setPeriodicWave: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      onended: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      channelCount: 0,
      channelCountMode: {} as ChannelCountMode,
      channelInterpretation: {} as ChannelInterpretation,
      context: {} as BaseAudioContext,
      numberOfInputs: 0,
      numberOfOutputs: 0,
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
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
      createGain: jest.fn(() => new GainNode()),
      createIIRFilter: jest.fn(),
      createOscillator: jest.fn(() => new OscillatorNode()),
      createPanner: jest.fn(),
      createPeriodicWave: jest.fn(),
      createScriptProcessor: jest.fn(),
      createStereoPanner: jest.fn(),
      createWaveShaper: jest.fn(),
      decodeAudioData: jest.fn(),
    };
  }
}

export {
  AudioContext as AudioContextMock,
  AudioNode as AudioNodeMock,
  GainNode as GainNodeMock,
  OscillatorNode as OscillatorNodeMock,
};
