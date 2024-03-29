import {
  type ChangeEvent,
  type FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  type KeyboardEvent,
  type SyntheticEvent,
  type FocusEvent,
  type FieldsetHTMLAttributes,
} from "react";
import ChevronDown from "src/icons/ChevronDown";
import X from "src/icons/X";
import { FloatingDropdown } from "src/components/floatingDropdown";
import { handleKeyDown } from "src/utils/htmlEvents";
import { ChevronUp } from "src/icons";
import { Fieldset } from "src/components/fieldset";
import { ButtonContainer } from "src/components/buttonContainer";

export type OptionObject = {
  key: string | number;
  value: string;
};
type Option = number | string | OptionObject;
const isOptionObject = (option: Option): option is OptionObject =>
  typeof option === "object";

interface Props {
  label: string;
  value?: Option;
  options: Option[];
  placeholder?: string;
  onChange: (key: string | number | undefined) => void;
  disableClear?: boolean;
}

const Select: FunctionComponent<
  Props & Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange">
> = ({
  label,
  value,
  options,
  placeholder,
  onChange,
  disableClear,
  ...otherProps
}) => {
  const [ownValue, setOwnValue] = useState("");
  const [optionsIsOpen, setOptionsIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [fieldsetHasFocus, setFieldsetHasFocus] = useState(false);

  const filteredOptions = useMemo(
    () =>
      options
        .map(option =>
          isOptionObject(option)
            ? option
            : { key: option, value: option.toString() },
        )
        .filter(option =>
          option.value.toLowerCase().startsWith(filterValue.toLowerCase()),
        ),
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

  const handleChange = (option: OptionObject | undefined) => {
    if (option) {
      setOwnValue(option.value);
      setFilterValue(option.value);
      onChange(option.key);
    }

    handleCloseOptions(true);
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
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
    onChange(undefined);
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
    if (event.currentTarget.contains(event.relatedTarget)) return;

    handleCloseOptions();
    setFieldsetHasFocus(false);
  };

  const handleChevronUp = (event: SyntheticEvent) => {
    event.stopPropagation();
    handleCloseOptions();
  };

  return (
    <Fieldset
      role="combobox"
      aria-label={`Select ${label}`}
      label={label}
      shrinkLabel={shrinkLabel}
      className={otherProps.className}
      onClick={handleClickFieldset}
      onKeyDown={handleKeyDownFieldset}
      onFocus={handleFocusFieldset}
      onBlur={handleBlurFieldset}
    >
      <div className="flex cursor-pointer items-center pb-2 pt-2">
        <input
          placeholder={placeholder || label}
          className="w-full cursor-pointer focus-visible:outline-none"
          value={fieldsetHasFocus ? filterValue : ownValue}
          onInput={handleChangeInput}
          onFocus={event => event.target.select()}
          tabIndex={0}
          ref={inputRef}
        />
        {ownValue && !disableClear ? (
          <ButtonContainer
            aria-label="Clear"
            onClick={event => handleClear(event)}
            onKeyDown={handleKeyDown("Enter", handleClear)}
            tabIndex={0}
          >
            <X width={16} height={16} strokeWidth={2} />
          </ButtonContainer>
        ) : null}
        <ButtonContainer
          aria-label={`${optionsIsOpen ? "Collapse" : "Expand"} options`}
          onKeyDown={
            optionsIsOpen
              ? handleKeyDown("Enter", handleChevronUp)
              : handleKeyDown("Enter", handleClickFieldset)
          }
          onClick={event =>
            optionsIsOpen ? handleChevronUp(event) : handleClickFieldset()
          }
          tabIndex={0}
        >
          {optionsIsOpen ? (
            <ChevronUp width={16} height={16} strokeWidth={2} />
          ) : (
            <ChevronDown width={16} height={16} strokeWidth={2} />
          )}
        </ButtonContainer>
      </div>
      <FloatingDropdown
        isOpen={optionsIsOpen}
        options={filteredOptions}
        onChangeOption={handleChange}
        onClose={handleCloseOptions}
        ref={floatingDropdownRef}
      />
    </Fieldset>
  );
};

export default Select;
