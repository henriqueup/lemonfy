/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AudioContextMock } from "@mocks/window";
import { render, type RenderResult, cleanup, act, prettyDOM } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import Editor from "src/pages/editor";

const mockAudioContext = new AudioContextMock();
jest.mock("src/hooks/useAudioContext", () => ({
  useAudioContext: mockAudioContext,
}));

describe("Navigation", () => {
  let rendered: RenderResult;
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    rendered = render(<Editor />);
  });

  afterEach(cleanup);

  it("Loads initially empty", () => {
    const buttons = rendered.getAllByRole("button");

    expect(buttons).toHaveLength(2);
  });

  it("Opens editor menu on click", async () => {
    const buttons = rendered.getAllByRole("button");

    expect(buttons).toHaveLength(2);
    const editorMenuButton = rendered.getByRole("button", { name: "Open Editor Menu" });

    await act(() => user.click(editorMenuButton));

    expect(rendered.getByRole("heading", { name: "Editor Menu" })).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Load" })).toBeInTheDocument();
  });

  it("Opens new sheet menu on click", async () => {
    const newSheetMenuButton = rendered.getByRole("button", { name: "New Sheet" });
    await act(() => user.click(newSheetMenuButton));

    expect(rendered.getByRole("heading", { name: "New Sheet" })).toBeInTheDocument();
    expect(rendered.getByPlaceholderText("Number of Tracks")).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("Creates new sheet", async () => {
    const newSheetMenuButton = rendered.getByRole("button", { name: "New Sheet" });
    await act(() => user.click(newSheetMenuButton));

    const addButton = rendered.getByRole("button", { name: "Add" });

    await act(async () => {
      await user.keyboard("3");
      await user.click(addButton);
    });

    expect(rendered.getByRole("group", { name: "Bars" })).toBeInTheDocument();
    expect(rendered.getByRole("group", { name: "Note Selector" })).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "New Bar" })).toBeInTheDocument();
    expect(rendered.getByRole("combobox", { name: "Select Octave" })).toBeInTheDocument();
    expect(rendered.getByRole("combobox", { name: "Select Duration" })).toBeInTheDocument();
  });

  it("Creates new bar", async () => {
    const newSheetMenuButton = rendered.getByRole("button", { name: "New Sheet" });
    await act(() => user.click(newSheetMenuButton));

    let addButton = rendered.getByRole("button", { name: "Add" });

    await act(async () => {
      await user.keyboard("3");
      await user.click(addButton);
    });

    const newBarMenuButton = rendered.getByRole("button", { name: "New Bar" });
    await act(() => user.click(newBarMenuButton));

    addButton = rendered.getByRole("button", { name: "Add" });

    await act(async () => {
      await user.keyboard("4{Tab}{Tab}4{Tab}{Tab}60");
      await user.click(addButton);
    });

    expect(rendered.getByText("4/4")).toBeInTheDocument();
    expect(rendered.getByText("60")).toBeInTheDocument();
  });
});

describe("Song creation", () => {
  let rendered: RenderResult;
  let user: UserEvent;

  beforeEach(async () => {
    user = userEvent.setup();
    rendered = render(<Editor />);

    const newSheetMenuButton = rendered.getByRole("button", { name: "New Sheet" });
    await act(() => user.click(newSheetMenuButton));

    let addButton = rendered.getByRole("button", { name: "Add" });

    await act(async () => {
      await user.keyboard("3");
      await user.click(addButton);
    });

    const newBarMenuButton = rendered.getByRole("button", { name: "New Bar" });
    await act(() => user.click(newBarMenuButton));

    addButton = rendered.getByRole("button", { name: "Add" });

    await act(async () => {
      await user.keyboard("4{Tab}{Tab}4{Tab}{Tab}60");
      await user.click(addButton);
    });
  });

  afterEach(cleanup);

  it("Changes note octave", async () => {
    await act(() => user.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}{ArrowDown}"));

    const octaveInput = rendered.getByPlaceholderText("Octave");
    expect(octaveInput).toHaveValue("2");
  });

  it("Changes note duration", async () => {
    await act(() => user.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowRight}"));

    const octaveInput = rendered.getByPlaceholderText("Duration");
    expect(octaveInput).toHaveValue("WHOLE");
  });

  it("Adds notes", async () => {
    await act(() => user.keyboard("{ArrowLeft}{ArrowLeft}")); // select LONG duration
    await act(() => user.keyboard("{ArrowUp}")); // select first octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

    expect(rendered.getByText("C#1")).toBeInTheDocument();

    await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}{Shift>}{ArrowLeft}{/Shift}")); // move cursor to start of next track
    await act(() => user.keyboard("{ArrowUp}")); // select second octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

    expect(rendered.getByText("C#2")).toBeInTheDocument();

    await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}{Shift>}{ArrowLeft}{/Shift}")); // move cursor to start of next track
    await act(() => user.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}")); // select EIGTH_TRIPLET duration
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

    console.log(prettyDOM(rendered.baseElement, 99999));
    expect(rendered.getAllByText("G#2")).toHaveLength(4);
    expect(rendered.getAllByText("C#3")).toHaveLength(4);
    expect(rendered.getAllByText("E3")).toHaveLength(3);
    expect(rendered.getAllByText("F3")).toHaveLength(1);

    await act(() => user.keyboard("{Shift>}{ArrowLeft}{ArrowLeft}{ArrowLeft}{/Shift}")); // move cursor to end of wrong F note
    await act(() => user.keyboard("{Backspace}")); // delete previous note
    await act(() => user.keyboard("e")); // add note E

    expect(rendered.getAllByText("G#2")).toHaveLength(4);
    expect(rendered.getAllByText("C#3")).toHaveLength(4);
    expect(rendered.getAllByText("E3")).toHaveLength(4);
    expect(rendered.queryByText("F3")).not.toBeInTheDocument();
  });

  it("Plays song", async () => {
    await addNotesToFirstBar();

    const editorMenuButton = rendered.getByRole("button", { name: "Open Editor Menu" });
    await act(() => user.click(editorMenuButton));

    const playButton = rendered.getByRole("button", { name: "Play" });
    await act(() => user.click(playButton));

    expect(mockAudioContext.createGain).toHaveBeenCalledTimes(1);
  });

  async function addNotesToFirstBar() {
    await act(() => user.keyboard("{ArrowLeft}{ArrowLeft}")); // select LONG duration
    await act(() => user.keyboard("{ArrowUp}")); // select first octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

    await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}{Shift>}{ArrowLeft}{/Shift}")); // move cursor to start of next track
    await act(() => user.keyboard("{ArrowUp}")); // select second octave
    await act(() => user.keyboard("{Shift>}C{/Shift}")); // add note C#

    await act(() => user.keyboard("{Control>}{ArrowDown}{/Control}{Shift>}{ArrowLeft}{/Shift}")); // move cursor to start of next track
    await act(() => user.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}")); // select EIGTH_TRIPLET duration
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
  }
});
