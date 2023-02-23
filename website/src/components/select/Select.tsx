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

const Select: FunctionComponent<
  Props & DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
> = ({ label, options, placeholder, handleChange, ...otherProps }) => {
  const [value, setValue] = useState("");
  const [optionsIsOpen, setOptionsIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const filteredOptions = useMemo(
    () => options.filter(option => option.value.toLowerCase().startsWith(filterValue.toLowerCase())),
    [options, filterValue],
  );

  const floatingDropdownRef = useRef<HTMLUListElement>(null);
  const shrinkLabel = value || filterValue || placeholder;

  const handleOwnChange = (option: Option | undefined) => {
    if (option) {
      setValue(option.value);
      setFilterValue(option.value);
      handleChange(option.key);
    }

    handleCloseOptions();
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
    setValue("");
    setFilterValue("");
    handleChange("");
    event.stopPropagation();
  };

  const handleFieldsetClick = () => {
    setOptionsIsOpen(true);
  };

  const handleCloseOptions = useCallback(() => {
    setOptionsIsOpen(false);
  }, []);

  return (
    <fieldset
      className={classNames("rounded pl-1 pr-1", otherProps.className)}
      style={{ marginTop: shrinkLabel ? undefined : "6px" }}
      onClick={handleFieldsetClick}
      onKeyDown={handleKeyDownFieldset}
    >
      {shrinkLabel && <legend role="presentation">{label}</legend>}
      <div className={classNames("flex cursor-pointer items-center pb-2", shrinkLabel && "pt-2")}>
        <input
          placeholder={placeholder || label}
          className="w-full cursor-pointer border-none bg-inherit text-base"
          value={filterValue}
          onInput={handleChangeInput}
          tabIndex={0}
        />
        <div
          className="flex cursor-pointer items-center rounded-full outline-none hover:bg-opacity-20 focus-visible:bg-opacity-20"
          onKeyDown={handleKeyDown("Enter", handleFieldsetClick)}
          tabIndex={0}
        >
          <ChevronDown width={16} height={16} fill="none" />
        </div>
        {value && (
          <div
            className="flex cursor-pointer items-center rounded-full outline-none hover:bg-opacity-20 focus-visible:bg-opacity-20"
            onClick={event => handleClear(event)}
            onKeyDown={handleKeyDown("Enter", handleClear)}
            tabIndex={0}
          >
            <X width={16} height={16} />
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
