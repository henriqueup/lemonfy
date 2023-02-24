import {
  type ChangeEvent,
  type DetailedHTMLProps,
  type FunctionComponent,
  type SelectHTMLAttributes,
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type SyntheticEvent,
  useMemo,
} from "react";
import { classNames } from "src/styles/utils";
import ChevronDown from "src/icons/ChevronDown";
import X from "src/icons/X";
import { FloatingDropdown } from "src/components/floatingDropdown";
import { handleKeyDown } from "src/utils/htmlEvents";

export interface Option {
  key: string | number;
  value: string;
}

interface Props {
  label: string;
  options: Option[];
  placeholder?: string;
  handleChange: (key: string | number) => void;
}

const iconClassName = classNames(
  "flex cursor-pointer items-center rounded-full p-1 outline-none",
  "hover:bg-white hover:bg-opacity-20 focus-visible:bg-white focus-visible:bg-opacity-20",
);

const Select: FunctionComponent<
  Props & DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
> = ({ label, options, placeholder, handleChange, ...otherProps }) => {
  const [value, setValue] = useState("");
  const [optionsIsOpen, setOptionsIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [inputHasFocus, setInputHasFocus] = useState(false);

  const filteredOptions = useMemo(
    () => options.filter(option => option.value.toLowerCase().startsWith(filterValue.toLowerCase())),
    [options, filterValue],
  );

  const floatingDropdownRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shrinkLabel = value || filterValue || placeholder;

  const handleCloseOptions = useCallback(
    (valueChanged = false) => {
      setOptionsIsOpen(false);

      if (!valueChanged) setFilterValue(value);
    },
    [value],
  );

  const handleOwnChange = (option: Option | undefined) => {
    if (option) {
      setValue(option.value);
      setFilterValue(option.value);
      handleChange(option.key);
    }

    handleCloseOptions(true);
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setFilterValue(newValue);
  };

  const handleFocusInput = () => {
    setInputHasFocus(true);
    // setFilterValue(value);
  };

  const handleBlurInput = () => {
    setInputHasFocus(false);
    // setFilterValue(value);
  };

  const handleKeyDownFieldset = (event: KeyboardEvent<HTMLFieldSetElement>) => {
    if (event.key === "ArrowDown") {
      setOptionsIsOpen(true);
      floatingDropdownRef.current?.focus();
      event.preventDefault();
    }
  };

  const handleClear = (event: SyntheticEvent) => {
    setValue("");
    setFilterValue("");
    handleChange("");
    event.stopPropagation();
  };

  const handleFieldsetClick = () => {
    setOptionsIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <fieldset
      className={classNames("rounded pl-1 pr-1 text-gray-400", !shrinkLabel && "mt-4", otherProps.className)}
      onClick={handleFieldsetClick}
      onKeyDown={handleKeyDownFieldset}
    >
      {shrinkLabel && <legend role="presentation">{label}</legend>}
      <div className={classNames("flex cursor-pointer items-center pt-2 pb-2", shrinkLabel && "pt-0")}>
        <input
          placeholder={placeholder || label}
          className="w-full cursor-pointer bg-inherit focus-visible:outline-none"
          value={inputHasFocus ? filterValue : value}
          onInput={handleChangeInput}
          onFocus={handleFocusInput}
          onBlur={handleBlurInput}
          tabIndex={0}
          ref={inputRef}
        />
        <div className={iconClassName} onKeyDown={handleKeyDown("Enter", handleFieldsetClick)} tabIndex={0}>
          <ChevronDown width={16} height={16} stroke="lightgray" fill="none" strokeWidth={2} />
        </div>
        {value && (
          <div
            className={iconClassName}
            onClick={event => handleClear(event)}
            onKeyDown={handleKeyDown("Enter", handleClear)}
            tabIndex={0}
          >
            <X width={16} height={16} stroke="lightgray" strokeWidth={2} />
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
