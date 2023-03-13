/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, type RenderResult, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { Select, type OptionObject } from "@components/select";

const mockOptions: OptionObject[] = [
  {
    key: "water",
    value: "Water",
  },
  {
    key: "fire",
    value: "Fire",
  },
];
const OPTION_BACKGROUND = "bg-black";
const FOCUSED_OPTION_BACKGROUND = "bg-neutral-800";

describe("Select", () => {
  let rendered: RenderResult;
  let handleChangeMock: jest.Mock;
  let user: UserEvent;

  const containsInitialOptions = () => {
    const options = rendered.getAllByRole("listitem");
    expect(options.length).toBe(mockOptions.length);

    mockOptions.forEach((mockOption, i) => {
      expect(options[i]!.textContent).toBe(mockOption.value);
      expect(options[i]!.className).toMatch(OPTION_BACKGROUND);
    });
  };

  const selectsNthOption = async (optionIndex: number) => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;
    await act(() => user.click(input));

    let options = rendered.getAllByRole("listitem");
    const targetOption = options.at(optionIndex)!;

    await act(() => user.click(targetOption));

    expect(input.value).toBe(mockOptions[optionIndex]!.value);
    expect(handleChangeMock).toHaveBeenCalledWith(mockOptions[optionIndex]!.key);

    options = rendered.queryAllByRole("listitem");
    expect(options.length).toBe(0);
  };

  beforeEach(() => {
    handleChangeMock = jest.fn();
    user = userEvent.setup();
    rendered = render(<Select label="Test Select" options={mockOptions} handleChange={handleChangeMock} />);
  });

  afterEach(cleanup);

  it("should render with label", () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    expect(input.placeholder).toBe("Test Select");
    expect(input.value).toBe("");
  });

  it("should open options on click", async () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;
    await act(() => user.click(input));

    containsInitialOptions();
  });

  it("should open options on chevron down icon click", async () => {
    const icon = rendered.getByRole("img");
    await act(() => user.click(icon));

    containsInitialOptions();
  });

  it("should open options on ArrowDown key", async () => {
    await act(() => user.keyboard("{Tab}{ArrowDown}"));

    containsInitialOptions();
  });

  it("should shrink label on type", async () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    await act(() => user.type(input, "asf"));
    const legend = rendered.getByRole("presentation");

    expect(legend.textContent).toBe("Test Select");
  });

  it("should shrink label with placeholder", () => {
    cleanup();
    rendered = render(
      <Select label="Test Select" options={mockOptions} handleChange={handleChangeMock} placeholder="Test Field" />,
    );

    const input = rendered.getByRole("textbox") as HTMLInputElement;
    const legend = rendered.getByRole("presentation");

    expect(input.placeholder).toBe("Test Field");
    expect(legend.textContent).toBe("Test Select");
  });

  it("should filter options on type", async () => {
    await act(() => user.keyboard("{Tab}{f}{ArrowDown}"));
    const options = rendered.getAllByRole("listitem");

    expect(options.length).toBe(1);
    expect(options[0]!.textContent).toMatch(mockOptions[1]!.value);
  });

  it("should select option on option click", async () => {
    await selectsNthOption(0);

    const icons = rendered.getAllByRole("img");
    const legend = rendered.getByRole("presentation");

    expect(icons.length).toBe(2);
    expect(legend.textContent).toBe("Test Select");
    expect(handleChangeMock).toHaveBeenCalledTimes(1);
  });

  it("should clear selection on clear icon click", async () => {
    await selectsNthOption(1);

    const icons = rendered.getAllByRole("img");
    await act(() => user.click(icons[0]!));

    const input = rendered.getByRole("textbox") as HTMLInputElement;

    expect(input.value).toBe("");
    expect(handleChangeMock).toHaveBeenCalledWith(undefined);
    expect(handleChangeMock).toHaveBeenCalledTimes(2);

    const options = rendered.queryAllByRole("listitem");
    expect(options.length).toBe(0);

    await act(() => user.click(input));
    containsInitialOptions();
  });

  it("should navigate options with arrows", async () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    await act(() => user.click(input));
    await act(() => user.keyboard("{ArrowDown}"));

    const options = rendered.getAllByRole("listitem");
    expect(options.length).toBe(mockOptions.length);

    expect(options[0]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);

    await act(() => user.keyboard("{ArrowDown}"));
    expect(options[0]!.className).not.toMatch(FOCUSED_OPTION_BACKGROUND);
    expect(options[1]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);

    await act(() => user.keyboard("{ArrowUp}"));
    expect(options[0]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);
    expect(options[1]!.className).not.toMatch(FOCUSED_OPTION_BACKGROUND);
  });

  it("should navigate options with tab", async () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    await act(() => user.click(input));
    await act(() => user.keyboard("{ArrowDown}"));

    const options = rendered.getAllByRole("listitem");
    expect(options.length).toBe(mockOptions.length);

    expect(options[0]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);

    await act(() => user.keyboard("{Tab}"));
    expect(options[0]!.className).not.toMatch(FOCUSED_OPTION_BACKGROUND);
    expect(options[1]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);

    await act(() => user.keyboard("'{Shift>}{Tab}{/Shift}'"));
    expect(options[0]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);
    expect(options[1]!.className).not.toMatch(FOCUSED_OPTION_BACKGROUND);
  });

  it("should select option on Enter press", async () => {
    const input = rendered.getByRole("textbox") as HTMLInputElement;

    await act(() => user.click(input));
    await act(() => user.keyboard("{ArrowDown}"));

    let options = rendered.getAllByRole("listitem");
    expect(options.length).toBe(mockOptions.length);

    expect(options[0]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);
    await act(() => user.keyboard("{Enter}"));

    expect(input.value).toBe(mockOptions[0]!.value);
    expect(handleChangeMock).toHaveBeenCalledWith(mockOptions[0]!.key);

    options = rendered.queryAllByRole("listitem");
    expect(options.length).toBe(0);

    const icons = rendered.getAllByRole("img");
    const legend = rendered.getByRole("presentation");

    expect(icons.length).toBe(2);
    expect(legend.textContent).toBe("Test Select");
    expect(handleChangeMock).toHaveBeenCalledTimes(1);
  });
});
