interface Animation extends EventTarget {
  currentTime: CSSNumberish | null;
  effect: AnimationEffect | null;
  readonly finished: Promise<Animation>;
  id: string;
  oncancel: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null;
  onfinish: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null;
  onremove: ((this: Animation, ev: Event) => any) | null;
  readonly pending: boolean;
  readonly playState: AnimationPlayState;
  playbackRate: number;
  readonly ready: Promise<Animation>;
  readonly replaceState: AnimationReplaceState;
  startTime: CSSNumberish | null;
  timeline: AnimationTimeline | null;
  cancel(): void;
  commitStyles(): void;
  finish(): void;
  pause(): void;
  persist(): void;
  play(): void;
  reverse(): void;
  updatePlaybackRate(playbackRate: number): void;
  addEventListener<K extends keyof AnimationEventMap>(
    type: K,
    listener: (this: Animation, ev: AnimationEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof AnimationEventMap>(
    type: K,
    listener: (this: Animation, ev: AnimationEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

class Animation implements Animation {
  constructor() {
    return {
      currentTime: null,
      effect: null,
      finished: Promise.resolve({} as Animation),
      id: "1",
      oncancel: jest.fn(),
      onfinish: jest.fn(),
      onremove: jest.fn(),
      pending: false,
      playState: "running",
      playbackRate: 0,
      ready: Promise.resolve({} as Animation),
      replaceState: "active",
      startTime: null,
      timeline: null,
      cancel: jest.fn(),
      commitStyles: jest.fn(),
      finish: jest.fn(),
      pause: jest.fn(),
      persist: jest.fn(),
      play: jest.fn(),
      reverse: jest.fn(),
      updatePlaybackRate: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  }
}

export const animateMock: jest.Mock<Animation> = jest.fn(() => new Animation());

export { Animation as AnimationMock };
