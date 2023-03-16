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
    const editorMenuButton = buttons[1]!;

    await act(() => user.click(editorMenuButton));

    expect(rendered.getByRole("heading", { name: "Editor Menu" })).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Load" })).toBeInTheDocument();
  });

  it("Opens new sheet menu on click", async () => {
    const buttons = rendered.getAllByRole("button");

    expect(buttons).toHaveLength(2);
    const newSheetMenuButton = buttons[0]!;

    await act(() => user.click(newSheetMenuButton));

    expect(rendered.getByRole("heading", { name: "New Sheet" })).toBeInTheDocument();
    expect(rendered.getByPlaceholderText("Number of Tracks")).toBeInTheDocument();
    expect(rendered.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("Creates new sheet", async () => {
    const buttons = rendered.getAllByRole("button");

    expect(buttons).toHaveLength(2);
    const newSheetMenuButton = buttons[0]!;

    await act(() => user.click(newSheetMenuButton));

    const sheetNumberInput = rendered.getByPlaceholderText("Number of Tracks");
    const addButton = rendered.getByRole("button", { name: "Add" });

    await act(async () => {
      await user.click(sheetNumberInput);
      await user.keyboard("3");
      await user.click(addButton);
    });

    expect(rendered.getByRole("group", { name: "Bars" })).toBeInTheDocument();
  });
});
