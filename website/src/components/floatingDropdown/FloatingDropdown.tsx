import { forwardRef, type Ref, useEffect, useState, type KeyboardEvent, type MouseEvent } from "react";
import { FloatingContainer } from "src/components/floatingContainer";
import type { Option } from "src/components/select";
import { classNames } from "src/styles/utils";

type Props = {
  open: boolean;
  options: Option[];
  onChangeOption: (option: Option | undefined) => void;
  onClose: () => void;
};

const FloatingDropdown = ({ open, options, onChangeOption, onClose }: Props, ref: Ref<HTMLUListElement>) => {
  const [index, setIndex] = useState(-1);

  const getLoopingIndex = (index: number, length: number) => {
    let value = index;
    if (index < 0) value = length + index;

    return value % length;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      setIndex(i => getLoopingIndex(i + 1, options.length));
    } else if (event.key === "ArrowUp") {
      setIndex(i => getLoopingIndex(i - 1, options.length));
    } else if (event.key === "Tab") {
      setIndex(i => getLoopingIndex(event.shiftKey ? i - 1 : i + 1, options.length));
      event.preventDefault();
    } else if (event.key === "Enter") {
      onChangeOption(options[index]);
    }
  };

  const handleClickOption = (event: MouseEvent, option: Option) => {
    event.stopPropagation();
    onChangeOption(option);
  };

  useEffect(() => {
    if (open) {
      setIndex(-1);
    }
  }, [open]);

  return (
    <FloatingContainer open={open} onClose={onClose}>
      <ul
        className="m-0 list-none rounded p-0 focus-visible:outline-none"
        onKeyDown={handleKeyDown}
        ref={ref}
        tabIndex={-1}
        onFocus={() => setIndex(0)}
      >
        {options.map((option, i) => (
          <li
            value={option.key}
            key={option.key}
            onClick={event => handleClickOption(event, option)}
            tabIndex={0}
            className={classNames(
              "w-full cursor-pointer bg-black text-orange-100 hover:bg-gray-800 focus-visible:outline-none",
              i === index && "bg-neutral-900",
            )}
          >
            {option.value}
          </li>
        ))}
      </ul>
    </FloatingContainer>
  );
};

export default forwardRef(FloatingDropdown);
