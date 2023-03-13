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
  });
});
