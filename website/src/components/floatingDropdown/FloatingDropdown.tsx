import { forwardRef, type Ref, useEffect, useState, type KeyboardEvent, type MouseEvent } from "react";
import { FloatingContainer } from "src/components/floatingContainer";
import type { OptionObject } from "src/components/select";
import { classNames } from "src/styles/utils";

type Props = {
  open: boolean;
  options: OptionObject[];
  onChangeOption: (option: OptionObject | undefined) => void;
  onClose: () => void;
};

const FloatingDropdown = ({ open, options, onChangeOption, onClose }: Props, listRef: Ref<HTMLUListElement>) => {
  const [index, setIndex] = useState(-1);

  const getLoopingIndex = (index: number, length: number) => {
    let value = index;
    if (index < 0) value = length + index;

    return value % length;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (!listRef || !("current" in listRef) || !listRef.current) return;

    event.stopPropagation();

    if (event.key === "Enter") {
      onChangeOption(options[index]);
      return;
    }

    const listItems = listRef.current.childNodes;
    let nextIndex = 0;

    if (event.key === "ArrowDown") {
      nextIndex = getLoopingIndex(index + 1, options.length);
    } else if (event.key === "ArrowUp") {
      nextIndex = getLoopingIndex(index - 1, options.length);
    } else if (event.key === "Tab") {
      if ((index === 0 && event.shiftKey) || (index === options.length - 1 && !event.shiftKey)) return;

      nextIndex = getLoopingIndex(event.shiftKey ? index - 1 : index + 1, options.length);
      event.preventDefault();
    }

    const targetChild = listItems[nextIndex];
    if (!targetChild) return;

    setIndex(nextIndex);
    (targetChild as HTMLElement).focus();
  };

  const handleFocusList = () => {
    if (index === -1) setIndex(0);
  };

  const handleClickOption = (event: MouseEvent, option: OptionObject) => {
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
        ref={listRef}
        tabIndex={-1}
        onFocus={handleFocusList}
      >
        {options.map((option, i) => (
          <li
            value={option.key}
            key={option.key}
            onClick={event => handleClickOption(event, option)}
            tabIndex={0}
            className={classNames(
              "w-full cursor-pointer text-inherit hover:bg-gray-800 focus-visible:outline-none",
              i === index ? "bg-neutral-800" : "bg-black",
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
