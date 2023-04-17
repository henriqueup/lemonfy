import { cleanup, render, type RenderResult, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { NumberField } from "src/components";

describe("Number Field", () => {
  let rendered: RenderResult;
  let handleChangeMock: jest.Mock;
  let user: UserEvent;

  beforeEach(() => {
    handleChangeMock = jest.fn();
    user = userEvent.setup();
    rendered = render(<NumberField label="Test Number Field" onChange={handleChangeMock} />);
  });

  afterEach(cleanup);

  it("should initially render with label as placeholder", () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    expect(input.placeholder).toBe("Test Number Field");
    expect(input.value).toBe("");
  });

  it("should shrink label with placeholder", () => {
    cleanup();
    rendered = render(
      <NumberField label="Test Number Field" onChange={handleChangeMock} placeholder="Test Placeholder" />,
    );

    const input = rendered.getByRole("textbox") as HTMLInputElement;
    const legend = rendered.getByRole("presentation");

    expect(input.placeholder).toBe("Test Placeholder");
    expect(legend.textContent).toBe("Test Number Field");
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
    rendered = render(<NumberField label="Test Number Field" onChange={handleChangeMock} autoFocus />);

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
});
