/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, type RenderResult, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import Editor from "src/pages/editor";

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
    expect(rendered.getByRole("button", { name: "Play" })).toBeInTheDocument();
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
    await act(async () => {
      await user.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}{ArrowDown}");
    });

    const octaveInput = rendered.getByPlaceholderText("Octave");
    expect(octaveInput).toHaveValue("2");
  });

  it("Changes note duration", async () => {
    await act(async () => {
      await user.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowRight}");
    });

    const octaveInput = rendered.getByPlaceholderText("Duration");
    expect(octaveInput).toHaveValue("WHOLE");
  });
});
