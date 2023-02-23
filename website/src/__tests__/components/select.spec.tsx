/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, type RenderResult, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, type Option } from "@components/select";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

const mockOptions: Option[] = [
  {
    key: "water",
    value: "Water",
  },
  {
    key: "fire",
    value: "Fire",
  },
];
const FOCUSED_OPTION_BACKGROUND = "bg-neutral-800";

describe("Select", () => {
  let wrapper: RenderResult;
  let handleChangeMock: jest.Mock;
  let user: UserEvent;

  const containsInitialOptions = () => {
    const options = wrapper.getAllByRole("listitem");
    expect(options.length).toBe(mockOptions.length);

    mockOptions.forEach((mockOption, i) => {
      expect(options[i]!.textContent).toBe(mockOption.value);
      expect(options[i]!.className).not.toMatch(FOCUSED_OPTION_BACKGROUND);
    });
  };

  const selectsNthOption = async (optionIndex: number) => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;
    await act(() => user.click(input));

    let options = wrapper.getAllByRole("listitem");
    const firstOption = options.at(optionIndex)!;

    await act(() => user.click(firstOption));

    expect(input.value).toBe(mockOptions[optionIndex]!.value);
    expect(handleChangeMock).toHaveBeenCalledWith(mockOptions[optionIndex]!.key);

    options = wrapper.queryAllByRole("listitem");
    expect(options.length).toBe(0);
  };

  beforeEach(() => {
    handleChangeMock = jest.fn();
    user = userEvent.setup();
    wrapper = render(<Select label="Test Select" options={mockOptions} handleChange={handleChangeMock} />);
  });

  afterEach(cleanup);

  it("should render with label", () => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;

    expect(input.placeholder).toBe("Test Select");
    expect(input.value).toBe("");
  });

  it("should open options on click", async () => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;
    await act(() => user.click(input));

    containsInitialOptions();
  });

  it("should open options on chevron down icon click", async () => {
    const icon = wrapper.getByRole("img");
    await act(() => user.click(icon));

    containsInitialOptions();
  });

  it("should open options on ArrowDown key", async () => {
    await act(() => user.keyboard("{Tab}{ArrowDown}"));

    containsInitialOptions();
  });

  it("should shrink label on type", async () => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;

    await act(() => user.type(input, "asf"));
    const legend = wrapper.getByRole("presentation");

    expect(legend.textContent).toBe("Test Select");
  });

  it("should shrink label with placeholder", () => {
    cleanup();
    wrapper = render(
      <Select label="Test Select" options={mockOptions} handleChange={handleChangeMock} placeholder="Test Field" />,
    );

    const input = wrapper.getByRole("textbox") as HTMLInputElement;
    const legend = wrapper.getByRole("presentation");

    expect(input.placeholder).toBe("Test Field");
    expect(legend.textContent).toBe("Test Select");
  });

  it("should filter options on type", async () => {
    await act(() => user.keyboard("{Tab}{f}{ArrowDown}"));
    const options = wrapper.getAllByRole("listitem");

    expect(options.length).toBe(1);
    expect(options[0]!.textContent).toMatch(mockOptions[1]!.value);
  });

  it("should select option on option click", async () => {
    await selectsNthOption(0);

    const icons = wrapper.getAllByRole("img");
    const legend = wrapper.getByRole("presentation");

    expect(icons.length).toBe(2);
    expect(legend.textContent).toBe("Test Select");
    expect(handleChangeMock).toHaveBeenCalledTimes(1);
  });

  it("should clear selection on clear icon click", async () => {
    await selectsNthOption(1);

    const icons = wrapper.getAllByRole("img");
    await act(() => user.click(icons[1]!));

    const input = wrapper.getByRole("textbox") as HTMLInputElement;

    expect(input.value).toBe("");
    expect(handleChangeMock).toHaveBeenCalledWith("");
    expect(handleChangeMock).toHaveBeenCalledTimes(2);

    const options = wrapper.queryAllByRole("listitem");
    expect(options.length).toBe(0);

    await act(() => user.click(input));
    containsInitialOptions();
  });

  it("should navigate options with arrows", async () => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;

    await act(() => user.click(input));
    await act(() => user.keyboard("{ArrowDown}"));

    const options = wrapper.getAllByRole("listitem");
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
    const input = wrapper.getByRole("textbox") as HTMLInputElement;

    await act(() => user.click(input));
    await act(() => user.keyboard("{ArrowDown}"));

    const options = wrapper.getAllByRole("listitem");
    expect(options.length).toBe(mockOptions.length);

    expect(options[0]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);

    await act(() => user.keyboard("{Tab}"));
    expect(options[0]!.className).not.toMatch(FOCUSED_OPTION_BACKGROUND);
    expect(options[1]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);

    await act(() => user.keyboard("'{Shift>}{Tab}{/Shift}'"));
    expect(options[0]!.className).toMatch(FOCUSED_OPTION_BACKGROUND);
    expect(options[1]!.className).not.toMatch(FOCUSED_OPTION_BACKGROUND);
  });
});
