/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AnimationMock,
  AudioContextMock,
  GainNodeMock,
  OscillatorNodeMock,
  animateMock,
} from "@mocks/window";
import { usePlayerStore } from "@store/player";
import {
  render,
  type RenderResult,
  cleanup,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import Editor from "src/pages/editor";

let mockGainNode: GainNodeMock;
let mockOscillatorNode: OscillatorNodeMock;
let mockAnimation: AnimationMock;
var mockAudioContext = new AudioContextMock();
jest.mock("src/hooks/useAudioContext", () => ({
  useAudioContext: () => mockAudioContext,
}));
let rendered: RenderResult;
let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
  rendered = render(<Editor />);

  mockGainNode = new GainNodeMock();
  mockOscillatorNode = new OscillatorNodeMock();
  mockAnimation = new AnimationMock();
});

afterEach(cleanup);

describe("Navigation", () => {
  it("Loads initially empty", () => {
    const buttons = rendered.getAllByRole("button");

    expect(buttons).toHaveLength(2);
  });

  it("Opens editor menu on click", async () => {
    const buttons = rendered.getAllByRole("button");

    expect(buttons).toHaveLength(2);
    const editorMenuButton = rendered.getByRole("button", {
      name: "Open Editor Menu",
    });

    await act(() => user.click(editorMenuButton));

    expect(
      rendered.getByRole("heading", { name: "Editor Menu" }),
    ).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Load" })).toBeInTheDocument();
  });

  it("Opens new song menu on click", async () => {
    const newSongMenuButton = rendered.getByRole("button", {
      name: "New Song",
    });
    await act(() => user.click(newSongMenuButton));

    expect(
      rendered.getByRole("heading", { name: "New Song" }),
    ).toBeInTheDocument();
    expect(rendered.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(rendered.getByPlaceholderText("Artist")).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("Creates new song", async () => {
    await createSong();

    expect(
      rendered.getByRole("group", { name: "Test song - Me" }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole("button", { name: "New Sheet" }),
    ).toBeInTheDocument();
  });

  it("Opens new sheet menu on click", async () => {
    await createSong();

    const newSheetMenuButton = rendered.getByRole("button", {
      name: "New Sheet",
    });
    await act(() => user.click(newSheetMenuButton));

    expect(
      rendered.getByRole("heading", { name: "New Sheet" }),
    ).toBeInTheDocument();
    expect(
      rendered.getByPlaceholderText("Number of Tracks"),
    ).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("Creates new sheet", async () => {
    await createSheet();

    expect(rendered.getByRole("group", { name: "Bars" })).toBeInTheDocument();
    expect(
      rendered.getByRole("group", { name: "Note Selector" }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole("button", { name: "New Bar" }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole("combobox", { name: "Select Octave" }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole("combobox", { name: "Select Duration" }),
    ).toBeInTheDocument();
  });

  it("Creates new bar", async () => {
    await createBar();

    expect(rendered.getByText("4/4")).toBeInTheDocument();
    expect(rendered.getByText("60")).toBeInTheDocument();
  });
});

describe("Song creation", () => {
  beforeEach(async () => {
    await createBar();
  });

  it("Changes note octave", async () => {
    await act(() => user.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}{ArrowDown}"));

    const octaveInput = rendered.getByPlaceholderText("Octave");
    expect(octaveInput).toHaveValue("2");
  });

  it("Changes note duration", async () => {
    await act(() =>
      user.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowRight}"),
    );

    const octaveInput = rendered.getByPlaceholderText("Duration");
    expect(octaveInput).toHaveValue("WHOLE");
  });

  it("Adds and removes notes", async () => {
    await act(() => user.keyboard("{ArrowLeft}{ArrowLeft}")); // select LONG duration
    await act(() => user.keyboard("{ArrowUp}")); // select first octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

    expect(rendered.getByText("C#1")).toBeInTheDocument();

    await act(() =>
      user.keyboard(
        "{Control>}{ArrowDown}{/Control}{Shift>}{ArrowLeft}{/Shift}",
      ),
    ); // move cursor to start of next track
    await act(() => user.keyboard("{ArrowUp}")); // select second octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

    expect(rendered.getByText("C#2")).toBeInTheDocument();

    await act(() =>
      user.keyboard(
        "{Control>}{ArrowDown}{/Control}{Shift>}{ArrowLeft}{/Shift}",
      ),
    ); // move cursor to start of next track
    await act(() =>
      user.keyboard(
        "{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}",
      ),
    ); // select EIGTH_TRIPLET duration
    await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
    await act(() => user.keyboard("{ArrowUp}")); // raise octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
    await act(() => user.keyboard("e")); // add note E
    await act(() => user.keyboard("{ArrowDown}")); // lower octave
    await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
    await act(() => user.keyboard("{ArrowUp}")); // raise octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
    await act(() => user.keyboard("e")); // add note E
    await act(() => user.keyboard("{ArrowDown}")); // lower octave
    await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
    await act(() => user.keyboard("{ArrowUp}")); // raise octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
    await act(() => user.keyboard("F")); // add note F by mistake
    await act(() => user.keyboard("{ArrowDown}")); // lower octave
    await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
    await act(() => user.keyboard("{ArrowUp}")); // raise octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
    await act(() => user.keyboard("e")); // add note E

    expect(rendered.getAllByText("G#2")).toHaveLength(4);
    expect(rendered.getAllByText("C#3")).toHaveLength(4);
    expect(rendered.getAllByText("E3")).toHaveLength(3);
    expect(rendered.getAllByText("F3")).toHaveLength(1);

    await act(() =>
      user.keyboard("{Shift>}{ArrowLeft}{ArrowLeft}{ArrowLeft}{/Shift}"),
    ); // move cursor to end of wrong F note
    await act(() => user.keyboard("{Backspace}")); // delete previous note
    await act(() => user.keyboard("e")); // add note E

    expect(rendered.getAllByText("G#2")).toHaveLength(4);
    expect(rendered.getAllByText("C#3")).toHaveLength(4);
    expect(rendered.getAllByText("E3")).toHaveLength(4);
    expect(rendered.queryByText("F3")).not.toBeInTheDocument();
  });
});

describe("Song playback", () => {
  beforeEach(async () => {
    (mockAudioContext.createGain as jest.Mock).mockImplementation(
      () => mockGainNode,
    );
    (mockAudioContext.createOscillator as jest.Mock).mockImplementation(
      () => mockOscillatorNode,
    );
    (HTMLDivElement.prototype.animate as jest.Mock).mockImplementation(
      () => mockAnimation,
    );
    animateMock.mockClear();

    await createBar();
    await addNotesToFirstBar();
  });

  it("Plays song", async () => {
    const playButton = rendered.getByRole("button", { name: "Play" });
    await act(() => user.click(playButton));

    expect(animateMock).toHaveBeenCalledTimes(1);
    expect(animateMock).toHaveBeenCalledWith(
      [{ left: "0%" }, { left: "100%" }],
      {
        duration: 4 * 1000,
        easing: "linear",
      },
    );

    expect(mockAudioContext.createGain).toHaveBeenCalledTimes(13);
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(13);
    expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledTimes(39);
    expect(mockOscillatorNode.start).toHaveBeenCalledTimes(13);
  });

  it("Pauses song", async () => {
    const playButton = rendered.getByRole("button", { name: "Play" });
    await act(() => user.click(playButton));

    const pauseButton = rendered.getByRole("button", { name: "Pause" });
    await act(() => user.click(pauseButton));

    // force the pause to be at the middle of the bar
    act(() => {
      usePlayerStore.setState(state => ({
        ...state,
        cursor: {
          ...state.cursor,
          position: 1 / 2,
        },
      }));
    });

    expect(animateMock).toHaveBeenCalledTimes(1);
    expect(animateMock).toHaveBeenCalledWith(
      [{ left: "0%" }, { left: "100%" }],
      {
        duration: 4 * 1000,
        easing: "linear",
      },
    );

    expect(mockAnimation.cancel).toHaveBeenCalledTimes(1);
    expect(mockGainNode.disconnect).toHaveBeenCalledTimes(13);
    expect(mockOscillatorNode.disconnect).toHaveBeenCalledTimes(13);

    const cursor = rendered.getByRole("presentation", { name: "Cursor" });
    expect(cursor.style.left).toBe("calc(50% - 4px)");
  });
});

const createSong = async () => {
  const newSongMenuButton = rendered.getByRole("button", {
    name: "New Song",
  });
  await act(() => user.click(newSongMenuButton));

  const addButton = rendered.getByRole("button", { name: "Add" });

  await act(async () => {
    await user.keyboard("Test song{Tab}{Tab}Me");
    await user.click(addButton);
  });
};

const createSheet = async () => {
  await createSong();

  const newSheetMenuButton = rendered.getByRole("button", {
    name: "New Sheet",
  });
  await act(() => user.click(newSheetMenuButton));

  const addButton = rendered.getByRole("button", { name: "Add" });

  await act(async () => {
    await user.keyboard("3");
    await user.click(addButton);
  });
};

const createBar = async () => {
  await createSheet();

  const newBarMenuButton = rendered.getByRole("button", { name: "New Bar" });
  await act(() => user.click(newBarMenuButton));

  const addButton = rendered.getByRole("button", { name: "Add" });

  await act(async () => {
    await user.keyboard("4{Tab}{Tab}4{Tab}{Tab}60");
    await user.click(addButton);
  });
};

const addNotesToFirstBar = async () => {
  await act(() => user.keyboard("{ArrowLeft}{ArrowLeft}")); // select LONG duration
  await act(() => user.keyboard("{ArrowUp}")); // select first octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

  await act(() =>
    user.keyboard("{Control>}{ArrowDown}{/Control}{Shift>}{ArrowLeft}{/Shift}"),
  ); // move cursor to start of next track
  await act(() => user.keyboard("{ArrowUp}")); // select second octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

  await act(() =>
    user.keyboard("{Control>}{ArrowDown}{/Control}{Shift>}{ArrowLeft}{/Shift}"),
  ); // move cursor to start of next track
  await act(() =>
    user.keyboard(
      "{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}",
    ),
  ); // select EIGTH_TRIPLET duration
  await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
  await act(() => user.keyboard("{ArrowUp}")); // raise octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
  await act(() => user.keyboard("e")); // add note E
  await act(() => user.keyboard("{ArrowDown}")); // lower octave
  await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
  await act(() => user.keyboard("{ArrowUp}")); // raise octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
  await act(() => user.keyboard("e")); // add note E
  await act(() => user.keyboard("{ArrowDown}")); // lower octave
  await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
  await act(() => user.keyboard("{ArrowUp}")); // raise octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
  await act(() => user.keyboard("E")); // add note E
  await act(() => user.keyboard("{ArrowDown}")); // lower octave
  await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
  await act(() => user.keyboard("{ArrowUp}")); // raise octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
  await act(() => user.keyboard("e")); // add note E

  await act(() =>
    user.keyboard("{Control>}{Shift>}{ArrowLeft}{/Shift}{/Control}"),
  ); // move cursor to start
};
