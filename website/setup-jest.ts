import "@testing-library/jest-dom/extend-expect";
import { AudioContextMock, DOMRectMock } from "@mocks/window";

global.AudioContext = AudioContextMock;
global.DOMRect = DOMRectMock;
global.HTMLDivElement.prototype.animate = jest.fn();
global.window.matchMedia = jest.fn(() => ({ matches: true } as MediaQueryList));
