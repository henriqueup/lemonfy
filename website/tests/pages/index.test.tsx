import { render, RenderResult, screen } from "@testing-library/react";
import React from "react";
import Home from "../../pages/index";
import AudioContextMock from "../mocks/audioContextMock";

jest.mock("../mocks/audioContextMock");
window.AudioContext = AudioContextMock;

describe("Home page", () => {
  let component: RenderResult;
  beforeEach(() => {
    component = render(<Home audioBufferJSON={{ type: "ArrayBuffer", data: [1, 2] }} />);
    expect(AudioContextMock).toHaveBeenCalledTimes(1);
  });

  it("should render both buttons", () => {
    expect(screen.getByText("MIAU after 1 second")).toBeInTheDocument();
    expect(screen.getByText("MIAU after 2.5 seconds")).toBeInTheDocument();
  });
});
