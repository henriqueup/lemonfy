import "@testing-library/jest-dom/extend-expect";
import { AudioContextMock, DOMRectMock } from "@mocks/window";

global.AudioContext = AudioContextMock;
global.DOMRect = DOMRectMock;
