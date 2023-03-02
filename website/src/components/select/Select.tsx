import {
  type ChangeEvent,
  type DetailedHTMLProps,
  type FunctionComponent,
  type SelectHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  type KeyboardEvent,
  type SyntheticEvent,
  type FocusEvent,
} from "react";
import { classNames } from "src/styles/utils";
import ChevronDown from "src/icons/ChevronDown";
import X from "src/icons/X";
import { FloatingDropdown } from "src/components/floatingDropdown";
import { handleKeyDown } from "src/utils/htmlEvents";
import { ChevronUp } from "src/icons";

export type OptionObject = {
  key: string | number;
  value: string;
};
type Option = number | string | OptionObject;
const isOptionObject = (option: Option): option is OptionObject => typeof option === "object";

interface Props {
  label: string;
  value?: Option;
  options: Option[];
  placeholder?: string;
  handleChange: (key: string | number | undefined) => void;
  disableClear?: boolean;
}

const iconClassName = classNames(
  "flex cursor-pointer items-center rounded-full p-1 outline-none",
  "hover:bg-white hover:bg-opacity-20 focus-visible:bg-white focus-visible:bg-opacity-20",
);

const Select: FunctionComponent<
  Props & Omit<DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, "value">
> = ({ label, value, options, placeholder, handleChange, disableClear, ...otherProps }) => {
  const [ownValue, setOwnValue] = useState("");
  const [optionsIsOpen, setOptionsIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [fieldsetHasFocus, setFieldsetHasFocus] = useState(false);

  const filteredOptions = useMemo(
    () =>
      options
        .map(option => (isOptionObject(option) ? option : { key: option, value: option.toString() }))
        .filter(option => option.value.toLowerCase().startsWith(filterValue.toLowerCase())),
    [options, filterValue],
  );

  useEffect(() => {
    if (value === undefined) return;

    const stringValue = isOptionObject(value) ? value.value : value.toString();
    setOwnValue(stringValue);
    setFilterValue(stringValue);
  }, [value]);

  const inputRef = useRef<HTMLInputElement>(null);
  const floatingDropdownRef = useRef<HTMLUListElement>(null);
  const shrinkLabel = Boolean(ownValue || filterValue || placeholder);

  const handleCloseOptions = useCallback(
    (valueChanged = false) => {
      setOptionsIsOpen(false);

      if (!valueChanged) setFilterValue(ownValue);
    },
    [ownValue],
  );

  const handleOwnChange = (option: OptionObject | undefined) => {
    if (option) {
      setOwnValue(option.value);
      setFilterValue(option.value);
      handleChange(option.key);
    }

    handleCloseOptions(true);
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setFilterValue(newValue);
  };

  const handleKeyDownFieldset = (event: KeyboardEvent<HTMLFieldSetElement>) => {
    if (event.key === "ArrowDown") {
      setOptionsIsOpen(true);
      floatingDropdownRef.current?.focus();
      event.preventDefault();
    }
  };

  const handleClear = (event: SyntheticEvent) => {
    setOwnValue("");
    setFilterValue("");
    handleChange(undefined);
    event.stopPropagation();
  };

  const handleClickFieldset = () => {
    setOptionsIsOpen(true);
    inputRef.current?.focus();
  };

  const handleFocusFieldset = () => {
    setFieldsetHasFocus(true);
  };

  const handleBlurFieldset = (event: FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      handleCloseOptions();
      setFieldsetHasFocus(false);
    }
  };

  const handleChevronUp = (event: SyntheticEvent) => {
    event.stopPropagation();
    handleCloseOptions();
  };

  return (
    <fieldset
      className={classNames(
        "relative rounded-lg border border-solid border-gray-400 bg-inherit pl-1 pr-1 text-gray-400",
        otherProps.className,
      )}
      onClick={handleClickFieldset}
      onKeyDown={handleKeyDownFieldset}
      onFocus={handleFocusFieldset}
      onBlur={handleBlurFieldset}
    >
      {shrinkLabel && (
        <legend
          role="presentation"
          className={classNames("absolute bg-inherit text-sm", "-top-[calc(theme(fontSize.sm[1].lineHeight)_/_2)]")}
        >
          {label}
        </legend>
      )}
      <div className="flex cursor-pointer items-center pb-2 pt-2">
        <input
          placeholder={placeholder || label}
          className="w-full cursor-pointer bg-inherit focus-visible:outline-none"
          value={fieldsetHasFocus ? filterValue : ownValue}
          onInput={handleChangeInput}
          tabIndex={0}
          ref={inputRef}
        />
        {ownValue && !disableClear && (
          <div
            className={iconClassName}
            onClick={event => handleClear(event)}
            onKeyDown={handleKeyDown("Enter", handleClear)}
            tabIndex={0}
          >
            <X width={16} height={16} stroke="lightgray" strokeWidth={2} />
          </div>
        )}
        {optionsIsOpen ? (
          <div
            className={iconClassName}
            onKeyDown={handleKeyDown("Enter", handleChevronUp)}
            onClick={handleChevronUp}
            tabIndex={0}
          >
            <ChevronUp width={16} height={16} stroke="lightgray" fill="none" strokeWidth={2} />
          </div>
        ) : (
          <div className={iconClassName} onKeyDown={handleKeyDown("Enter", handleClickFieldset)} tabIndex={0}>
            <ChevronDown width={16} height={16} stroke="lightgray" fill="none" strokeWidth={2} />
          </div>
        )}
      </div>
      <FloatingDropdown
        open={optionsIsOpen}
        options={filteredOptions}
        onChangeOption={handleOwnChange}
        onClose={handleCloseOptions}
        ref={floatingDropdownRef}
      />
    </fieldset>
  );
};

export default Select;
