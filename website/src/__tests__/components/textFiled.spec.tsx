import {
  cleanup,
  render,
  type RenderResult,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { TextField } from "src/components";

const ERROR_BORDER = /border-red-600 .* dark:border-red-600/;

describe("Text Field", () => {
  let rendered: RenderResult;
  let handleChangeMock: jest.Mock;
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    handleChangeMock = jest.fn();
    rendered = render(
      <TextField label="Test Text Field" onChange={handleChangeMock} />,
    );
  });

  afterEach(cleanup);

  it("should initially render with label as placeholder", () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    expect(input.placeholder).toBe("Test Text Field");
    expect(input.value).toBe("");
  });

  it("should hide label with placeholder and no value", () => {
    cleanup();
    rendered = render(
      <TextField
        label="Test Text Field"
        onChange={handleChangeMock}
        placeholder="Test Placeholder"
      />,
    );

    const input = rendered.getByRole("textbox") as HTMLInputElement;
    const legend = rendered.queryByRole("presentation");

    expect(input.placeholder).toBe("Test Placeholder");
    expect(legend).not.toBeInTheDocument();
  });

  it("should shrink label on type", async () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    await act(() => user.type(input, "12asf"));
    rendered.rerender(
      <TextField
        label="Test Text Field"
        value="12asf"
        onChange={handleChangeMock}
      />,
    );
    const legend = rendered.getByRole("presentation");

    expect(legend.textContent).toBe("Test Text Field");
    expect(input.value).toBe("12asf");
    expect(handleChangeMock).toHaveBeenCalledTimes(5);
    expect(handleChangeMock).toHaveBeenCalledWith("1");
    expect(handleChangeMock).toHaveBeenCalledWith("2");
    expect(handleChangeMock).toHaveBeenCalledWith("a");
    expect(handleChangeMock).toHaveBeenCalledWith("s");
    expect(handleChangeMock).toHaveBeenCalledWith("f");
  });

  it("should have focus with autoFocus", async () => {
    cleanup();
    rendered = render(
      <TextField
        label="Test Text Field"
        onChange={handleChangeMock}
        autoFocus
      />,
    );

    expect(rendered.queryByRole("presentation")).not.toBeInTheDocument();
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    await act(() => user.keyboard("12asf"));
    rendered.rerender(
      <TextField
        label="Test Text Field"
        value="12asf"
        onChange={handleChangeMock}
        autoFocus
      />,
    );
    const legend = rendered.getByRole("presentation");

    expect(legend.textContent).toBe("Test Text Field");
    expect(input.value).toBe("12asf");
  });

  it("should clear content on clear icon click", async () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;
    await act(() => user.type(input, "12asf"));
    rendered.rerender(
      <TextField
        label="Test Text Field"
        value="12asf"
        onChange={handleChangeMock}
      />,
    );

    expect(input.value).toBe("12asf");

    const clearIcon = rendered.getByRole("button", { name: "Clear" });
    await act(() => user.click(clearIcon));

    expect(handleChangeMock).toHaveBeenCalledTimes(6);
    expect(handleChangeMock).toHaveBeenCalledWith("1");
    expect(handleChangeMock).toHaveBeenCalledWith("2");
    expect(handleChangeMock).toHaveBeenCalledWith("a");
    expect(handleChangeMock).toHaveBeenCalledWith("s");
    expect(handleChangeMock).toHaveBeenCalledWith("f");
    expect(handleChangeMock).toHaveBeenCalledWith(undefined);
  });

  it("should only display errors when dirty and hovered", async () => {
    cleanup();
    rendered = render(
      <TextField
        label="Test Text Field"
        onChange={handleChangeMock}
        errors={["Test Error 1", "Test Error 2"]}
      />,
    );

    expect(rendered.queryByRole("tooltip")).not.toBeInTheDocument();
    const inputGroup = rendered.getByRole("group");
    expect(inputGroup.className).not.toMatch(ERROR_BORDER);

    await act(() => user.click(inputGroup));
    await act(() => user.click(rendered.baseElement));

    expect(rendered.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(inputGroup.className).toMatch(ERROR_BORDER);

    await act(() => user.hover(inputGroup));

    expect(inputGroup.className).toMatch(ERROR_BORDER);
    const errors = rendered.getAllByRole("tooltip");
    expect(errors).toHaveLength(2);

    expect(errors[0]?.textContent).toBe("Test Error 1");
    expect(errors[1]?.textContent).toBe("Test Error 2");

    await act(() => user.unhover(inputGroup));
    expect(rendered.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(inputGroup.className).toMatch(ERROR_BORDER);
  });
});
