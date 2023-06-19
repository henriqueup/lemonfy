import {
  cleanup,
  render,
  type RenderResult,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { NumberField } from "src/components";

const ERROR_BORDER = /border-red-600 .* dark:border-red-600/;

describe("Number Field", () => {
  let rendered: RenderResult;
  let handleChangeMock: jest.Mock;
  let user: UserEvent;

  beforeEach(() => {
    handleChangeMock = jest.fn();
    user = userEvent.setup();
    rendered = render(
      <NumberField label="Test Number Field" onChange={handleChangeMock} />,
    );
  });

  afterEach(cleanup);

  it("should initially render with label as placeholder", () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    expect(input.placeholder).toBe("Test Number Field");
    expect(input.value).toBe("");
  });

  it("should hide label with placeholder and no value", () => {
    cleanup();
    rendered = render(
      <NumberField
        label="Test Number Field"
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

    await act(() => user.type(input, "12"));
    const legend = rendered.getByRole("presentation");

    expect(legend.textContent).toBe("Test Number Field");
    expect(input.value).toBe("12");
    expect(handleChangeMock).toHaveBeenCalledTimes(2);
    expect(handleChangeMock).toHaveBeenCalledWith(1);
    expect(handleChangeMock).toHaveBeenCalledWith(12);
  });

  it("should have focus with autoFocus", async () => {
    cleanup();
    rendered = render(
      <NumberField
        label="Test Number Field"
        onChange={handleChangeMock}
        autoFocus
      />,
    );

    expect(rendered.queryByRole("presentation")).not.toBeInTheDocument();
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    await act(() => user.keyboard("12"));
    const legend = rendered.getByRole("presentation");

    expect(legend.textContent).toBe("Test Number Field");
    expect(input.value).toBe("12");
  });

  it("should only accept numbers", async () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;
    await act(() => user.type(input, "asf"));

    expect(rendered.queryByRole("presentation")).not.toBeInTheDocument();
    expect(input.value).toBe("");
  });

  it("should clear content on clear icon click", async () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;
    await act(() => user.type(input, "12"));

    expect(input.value).toBe("12");

    const clearIcon = rendered.getByRole("button", { name: "Clear" });
    await act(() => user.click(clearIcon));

    expect(input.value).toBe("");
    expect(handleChangeMock).toHaveBeenCalledTimes(3);
    expect(handleChangeMock).toHaveBeenCalledWith(1);
    expect(handleChangeMock).toHaveBeenCalledWith(12);
    expect(handleChangeMock).toHaveBeenCalledWith(undefined);
  });

  it("should only display errors when dirty and hovered", async () => {
    cleanup();
    rendered = render(
      <NumberField
        label="Test Number Field"
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
