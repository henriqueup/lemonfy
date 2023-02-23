/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, fireEvent, type RenderResult, cleanup, act } from "@testing-library/react";
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

describe("Select", () => {
  let wrapper: RenderResult;
  let handleChangeMock: jest.Mock;
  let user: UserEvent;

  const containsInitialOptions = () => {
    const options = wrapper.getAllByRole("listitem");
    expect(options.length).toBe(mockOptions.length);

    mockOptions.forEach((mockOption, i) => {
      expect(options[i]!.textContent).toBe(mockOption.value);
      console.log(options[i]!.style);
      expect(options[i]!).toHaveStyle({ backgroundColor: "black" });
    });
  };

  const selectsNthOption = async (optionIndex: number) => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;
    fireEvent.click(input);

    let options = wrapper.getAllByRole("listitem");
    const firstOption = options.at(optionIndex)!;

    await act(async () => user.click(firstOption));

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

  it("should open options on click", () => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;
    fireEvent.click(input);

    containsInitialOptions();
  });

  it("should open options on chevron down icon click", () => {
    const icon = wrapper.getByRole("img");
    fireEvent.click(icon);

    containsInitialOptions();
  });

  it("should open options on ArrowDown key", () => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowDown" });

    containsInitialOptions();
  });

  it("should shrink label on type", async () => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;

    await user.type(input, "asf");
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
    const input = wrapper.getByRole("textbox") as HTMLInputElement;

    await user.type(input, "f");
    fireEvent.click(input);

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
    fireEvent.click(icons[1]!);

    const input = wrapper.getByRole("textbox") as HTMLInputElement;

    expect(input.value).toBe("");
    expect(handleChangeMock).toHaveBeenCalledWith("");
    expect(handleChangeMock).toHaveBeenCalledTimes(2);

    const options = wrapper.queryAllByRole("listitem");
    expect(options.length).toBe(0);

    fireEvent.click(input);
    containsInitialOptions();
  });

  it("should navigate options with arrows", () => {
    const input = wrapper.getByRole("textbox") as HTMLInputElement;
    fireEvent.click(input);

    containsInitialOptions();
  });
});
