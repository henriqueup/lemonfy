import "@testing-library/jest-dom/extend-expect";
import { AudioContextMock, DOMRectMock, animateMock } from "@mocks/window";

global.AudioContext = AudioContextMock;
global.DOMRect = DOMRectMock;
global.HTMLDivElement.prototype.animate = animateMock;
global.window.matchMedia = jest.fn(() => ({ matches: true } as MediaQueryList));
