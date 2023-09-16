/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  render,
  type RenderResult,
  cleanup,
  act,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

import { withNextTRPC } from "@/mocks/utils/tRPC";
import {
  AnimationMock,
  AudioContextMock,
  GainNodeMock,
  OscillatorNodeMock,
  animateMock,
} from "@/mocks/window";
import { usePlayerStore } from "@/store/player";
import Editor from "src/pages/editor/Editor";
import { getCompleteMoonlightSonataMockSheet } from "@/mocks/entities/sheet";
import { getMockSong } from "@/mocks/entities/song";
import { mockUseRouter } from "@/mocks/next/router";
import { MyApp } from "@/pages/_app";

jest.unmock("immer");
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => mockUseRouter),
}));

let mockGainNode: GainNodeMock;
let mockOscillatorNode: OscillatorNodeMock;
let mockAnimation: AnimationMock;
// eslint-disable-next-line no-var
var mockAudioContext = new AudioContextMock();
jest.mock("src/hooks/useAudioContext", () => ({
  useAudioContext: () => mockAudioContext,
}));

let rendered: RenderResult;
let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
  rendered = render(
    <MyApp Component={Editor} pageProps={{}} router={mockUseRouter} />,
    { wrapper: withNextTRPC },
  );

  mockGainNode = new GainNodeMock();
  mockOscillatorNode = new OscillatorNodeMock();
  mockAnimation = new AnimationMock();
});

afterEach(cleanup);

describe("Navigation", () => {
  it("Loads initially empty", () => {
    const menubar = rendered.getByRole("menubar");
    const menuitems = rendered.getAllByRole("menuitem");
    const newSongMenuButton = rendered.getByRole("button", {
      name: "New Song",
    });

    expect(menubar).toBeInTheDocument();
    expect(menuitems).toHaveLength(3);

    expect(menuitems[0]!.textContent).toBe("File");
    expect(menuitems[1]!.textContent).toBe("Edit");
    expect(menuitems[2]!.textContent).toBe("Cursor");

    expect(newSongMenuButton).toBeInTheDocument();
  });

  it("Opens new song menu on click", async () => {
    const newSongMenuButton = rendered.getByRole("button", {
      name: "New Song",
    });
    await act(() => user.click(newSongMenuButton));

    expect(
      rendered.getByRole("heading", { name: "Create Song" }),
    ).toBeInTheDocument();
    expect(rendered.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(rendered.getByPlaceholderText("Artist")).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("Creates new song", async () => {
    await createSong();

    expect(
      rendered.getByRole("heading", { name: "Test song - Me" }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole("button", { name: "New Sheet" }),
    ).toBeInTheDocument();
  });

  it("Edits song", async () => {
    await createSong();

    const songNameLabel = rendered.getByText("Test song - Me");

    expect(songNameLabel).toBeInTheDocument();
    expect(
      rendered.getByRole("button", { name: "New Sheet" }),
    ).toBeInTheDocument();

    await act(() => user.click(songNameLabel));

    expect(
      rendered.getByRole("heading", { name: "Edit Song" }),
    ).toBeInTheDocument();

    const saveButton = rendered.getByRole("button", { name: "Save" });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    const artistInput = rendered.getByPlaceholderText("Artist");
    expect(artistInput).toBeInTheDocument();

    await act(async () => {
      await user.click(artistInput);
      await user.keyboard("You");
    });

    expect(saveButton).not.toBeDisabled();

    await act(() => user.click(saveButton));

    expect(rendered.getByText("Test song - You")).toBeInTheDocument();
  });

  it("Opens new instrument menu on click", async () => {
    await createSong();

    const addInstrumentMenuButton = rendered.getByRole("button", {
      name: "Add Instrument",
    });
    await act(() => user.click(addInstrumentMenuButton));

    expect(
      rendered.getByRole("heading", { name: "Add Instrument" }),
    ).toBeInTheDocument();
    expect(rendered.getByRole("combobox")).toBeInTheDocument();
    expect(
      rendered.getByRole("button", { name: "New Instrument" }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole("button", { name: "Go to Instruments" }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole("button", { name: "Add to Song" }),
    ).toBeInTheDocument();
  });

  it("Creates new sheet", async () => {
    await createSheet();

    expect(rendered.getByRole("group", { name: "Bars" })).toBeInTheDocument();
    expect(
      rendered.getByRole("button", { name: "New Bar" }),
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
    await act(() =>
      user.keyboard(
        "{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowDown}{/Control}",
      ),
    );

    const octaveLabel = rendered.getByText("Octave: 2");
    expect(octaveLabel).toBeInTheDocument();
  });

  it("Changes note duration", async () => {
    await act(() =>
      user.keyboard("{Alt>}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowUp}{/Alt}"),
    );

    const durationLabel = rendered.getByText("Note Duration: WHOLE");
    expect(durationLabel).toBeInTheDocument();
  });

  it("Adds and removes notes", async () => {
    await act(() => user.keyboard("{Alt>}{ArrowDown}{ArrowDown}{/Alt}")); // select LONG duration
    await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // select first octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

    expect(rendered.getByText("C#1")).toBeInTheDocument();

    await act(() => user.keyboard("{ArrowDown}{ArrowLeft}")); // move cursor to start of next track
    await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // select second octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

    expect(rendered.getByText("C#2")).toBeInTheDocument();

    await act(() => user.keyboard("{ArrowDown}{ArrowLeft}")); // move cursor to start of next track
    await act(() =>
      user.keyboard(
        "{Alt>}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{/Alt}",
      ),
    ); // select EIGTH_TRIPLET duration
    await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
    await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // raise octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
    await act(() => user.keyboard("e")); // add note E
    await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}")); // lower octave
    await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
    await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // raise octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
    await act(() => user.keyboard("e")); // add note E
    await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}")); // lower octave
    await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
    await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // raise octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
    await act(() => user.keyboard("f")); // add note F by mistake
    await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}")); // lower octave
    await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
    await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // raise octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
    await act(() => user.keyboard("e")); // add note E

    expect(rendered.getAllByText("G#2")).toHaveLength(4);
    expect(rendered.getAllByText("C#3")).toHaveLength(4);
    expect(rendered.getAllByText("E3")).toHaveLength(3);
    expect(rendered.getAllByText("F3")).toHaveLength(1);

    await act(() => user.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}")); // move cursor to end of wrong F note
    await act(() => user.keyboard("{Backspace}")); // delete previous note
    await act(() => user.keyboard("e")); // add note E

    expect(rendered.getAllByText("G#2")).toHaveLength(4);
    expect(rendered.getAllByText("C#3")).toHaveLength(4);
    expect(rendered.getAllByText("E3")).toHaveLength(4);
    expect(rendered.queryByText("F3")).not.toBeInTheDocument();
  });

  // it("Saves song", async () => {
  //   const mutateAsyncMock = jest.fn(() => "123");
  //   const saveSpy = jest.spyOn(api.song.save, "useMutation");
  //   saveSpy.mockImplementation(() => ({ mutateAsync: mutateAsyncMock }));

  //   await createBar();
  //   await addNotesToFirstBar();

  //   const editorMenuButton = rendered.getByRole("button", {
  //     name: "Open Editor Menu",
  //   });

  //   await act(() => user.click(editorMenuButton));

  //   const saveButton = rendered.getByRole("button", { name: "Save" });

  //   await act(() => user.click(saveButton));

  //   expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
  //   expect(mutateAsyncMock).toHaveBeenCalledWith("123");
  // });
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

    expect(mockAudioContext.createGain).toHaveBeenCalledTimes(14);
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(14);
    expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledTimes(42);
    expect(mockOscillatorNode.start).toHaveBeenCalledTimes(14);
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
    expect(mockGainNode.disconnect).toHaveBeenCalledTimes(14);
    expect(mockOscillatorNode.disconnect).toHaveBeenCalledTimes(14);

    const cursor = rendered.getByRole("presentation", { name: "Cursor" });
    expect(cursor.style.left).toBe("calc(50% - 4px)");
  });
});

describe("Song loading", () => {
  it("Loads up with song to load", () => {
    const sheet = getCompleteMoonlightSonataMockSheet();
    const songToLoad = getMockSong([sheet]);

    cleanup();
    rendered = render(<Editor songToLoad={songToLoad} />, {
      wrapper: withNextTRPC,
    });

    expect(
      rendered.getByRole("group", { name: "Moonlight Sonata - Beethoven" }),
    ).toBeInTheDocument();

    expect(rendered.getByRole("group", { name: "Bars" })).toBeInTheDocument();
    expect(rendered.getAllByText("4/4")).toHaveLength(4);
    expect(rendered.getAllByText("54")).toHaveLength(4);

    const renderedBars = rendered.getAllByRole("group", { name: /Bar / });
    expect(renderedBars).toHaveLength(4);

    const firstBar = within(renderedBars[0]!);
    expect(firstBar.getAllByText("C#1")).toHaveLength(1);
    expect(firstBar.getAllByText("C#2")).toHaveLength(1);
    expect(firstBar.getAllByText("G#2")).toHaveLength(4);
    expect(firstBar.getAllByText("C#3")).toHaveLength(4);
    expect(firstBar.getAllByText("E3")).toHaveLength(4);

    const secondBar = within(renderedBars[1]!);
    expect(secondBar.getAllByText("B0")).toHaveLength(1);
    expect(secondBar.getAllByText("B1")).toHaveLength(1);
    expect(secondBar.getAllByText("G#2")).toHaveLength(4);
    expect(secondBar.getAllByText("C#3")).toHaveLength(4);
    expect(secondBar.getAllByText("E3")).toHaveLength(4);

    const thirdBar = within(renderedBars[2]!);
    expect(thirdBar.getAllByText("A0")).toHaveLength(1);
    expect(thirdBar.getAllByText("F#0")).toHaveLength(1);
    expect(thirdBar.getAllByText("A1")).toHaveLength(1);
    expect(thirdBar.getAllByText("F#1")).toHaveLength(1);
    expect(thirdBar.getAllByText("A2")).toHaveLength(4);
    expect(thirdBar.getAllByText("C#3")).toHaveLength(2);
    expect(thirdBar.getAllByText("E3")).toHaveLength(2);
    expect(thirdBar.getAllByText("D3")).toHaveLength(2);
    expect(thirdBar.getAllByText("F#3")).toHaveLength(2);

    const fourthBar = within(renderedBars[3]!);
    expect(fourthBar.getAllByText("G#0")).toHaveLength(1);
    expect(fourthBar.getAllByText("G#1")).toHaveLength(1);
    expect(fourthBar.getAllByText("G#2")).toHaveLength(3);
    expect(fourthBar.getAllByText("C3")).toHaveLength(2);
    expect(fourthBar.getAllByText("F#3")).toHaveLength(1);
    expect(fourthBar.getAllByText("C#3")).toHaveLength(2);
    expect(fourthBar.getAllByText("E3")).toHaveLength(1);
    expect(fourthBar.getAllByText("D#3")).toHaveLength(2);
    expect(fourthBar.getAllByText("F#2")).toHaveLength(1);
  });
});

const createSong = async () => {
  const newSongMenuButton = rendered.getByRole("button", {
    name: "New Song",
  });
  await act(() => user.click(newSongMenuButton));

  const addButton = rendered.getByRole("button", { name: "Save" });

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
  await act(() => user.keyboard("{Alt>}{ArrowDown}{ArrowDown}{/Alt}")); // select LONG duration
  await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // select first octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

  await act(() => user.keyboard("{ArrowDown}{ArrowLeft}")); // move cursor to start of next track
  await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // select second octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

  await act(() => user.keyboard("{ArrowDown}{ArrowLeft}")); // move cursor to start of next track
  await act(() =>
    user.keyboard(
      "{Alt>}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{/Alt}",
    ),
  ); // select EIGTH_TRIPLET duration
  await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
  await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // raise octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
  await act(() => user.keyboard("e")); // add note E
  await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}")); // lower octave
  await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
  await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // raise octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
  await act(() => user.keyboard("e")); // add note E
  await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}")); // lower octave
  await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
  await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // raise octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
  await act(() => user.keyboard("e")); // add note E
  await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}")); // lower octave
  await act(() => user.keyboard("{Shift>}G{/Shift}")); // add note G#
  await act(() => user.keyboard("{Control>}{ArrowUp}{/Control}")); // raise octave
  await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#
  await act(() => user.keyboard("e")); // add note E

  await act(() =>
    user.keyboard("{Control>}{Shift>}{ArrowLeft}{/Shift}{/Control}"),
  ); // move cursor to start
};
