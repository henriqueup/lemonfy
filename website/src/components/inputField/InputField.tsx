import {
  type ChangeEvent,
  type DetailedHTMLProps,
  type FunctionComponent,
  useRef,
  useState,
  type SyntheticEvent,
  type InputHTMLAttributes,
  type FieldsetHTMLAttributes,
  type KeyboardEvent,
  type FocusEvent,
} from "react";
import X from "src/icons/X";
import { handleKeyDown } from "src/utils/htmlEvents";
import { Fieldset } from "src/components/fieldset";
import { iconClassName } from "src/components/utils";

interface Props {
  label: string;
  value?: string | number;
  placeholder?: string;
  onChange: (key: string | number | undefined) => void;
  disableClear?: boolean;
  autoFocus?: boolean;
  inputProps?: Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "value" | "onChange">;
}

const BaseInputField: FunctionComponent<Props & Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange">> = ({
  label,
  value,
  placeholder,
  onChange,
  disableClear,
  inputProps,
  autoFocus = false,
  ...otherProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const shrinkLabel = Boolean(value || placeholder);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  const handleClear = (event: SyntheticEvent) => {
    onChange(undefined);
    event.stopPropagation();
  };

  const handleClickFieldset = () => {
    inputRef.current?.focus();
  };

  return (
    <Fieldset {...otherProps} label={label} shrinkLabel={shrinkLabel} onClick={handleClickFieldset}>
      <div className="flex cursor-pointer items-center pb-2 pt-2">
        <input
          autoFocus={autoFocus}
          {...inputProps}
          placeholder={placeholder || label}
          className="w-full cursor-pointer bg-inherit focus-visible:outline-none"
          value={value === undefined ? "" : value}
          onInput={handleChangeInput}
          onFocus={event => event.target.select()}
          tabIndex={0}
          ref={inputRef}
        />
        {value !== undefined && !disableClear ? (
          <div
            className={iconClassName}
            onClick={event => handleClear(event)}
            onKeyDown={handleKeyDown("Enter", handleClear)}
            tabIndex={0}
          >
            <X width={16} height={16} stroke="lightgray" strokeWidth={2} />
          </div>
        ) : null}
      </div>
    </Fieldset>
  );
};

interface TextFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChange: (key: string | undefined) => void;
  disableClear?: boolean;
  autoFocus?: boolean;
  inputProps?: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "value" | "onChange" | "type"
  >;
}

export const TextField: FunctionComponent<
  TextFieldProps & Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange">
> = ({ label, onChange, autoFocus, ...otherProps }) => {
  const handleChange = (newValue: string | number | undefined) => {
    if (typeof newValue === "number") {
      onChange(newValue.toString());
      return;
    }

    onChange(newValue);
  };

  return <BaseInputField {...otherProps} autoFocus={autoFocus} label={label} onChange={handleChange} />;
};

interface NumberFieldProps {
  label: string;
  value?: number;
  placeholder?: string;
  onChange: (key: number | undefined) => void;
  disableClear?: boolean;
  autoFocus?: boolean;
  inputProps?: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "value" | "onChange" | "type"
  >;
}

export const NumberField: FunctionComponent<
  NumberFieldProps & Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange">
> = ({ label, onChange, autoFocus, ...otherProps }) => {
  const [ownValue, setOwnValue] = useState<number | string | undefined>(otherProps.value);

  const getActualValue = (value: string | number | undefined) => {
    let actualValue: number | undefined = Number(value);
    if (value === "" || value === undefined) actualValue = undefined;

    return actualValue;
  };

  const handleChange = (newValue: string | number | undefined) => {
    setOwnValue(newValue);

    const actualValue = getActualValue(newValue);
    onChange(actualValue);
  };

  const handleBlur = (event: FocusEvent) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;

    const actualValue = getActualValue(ownValue);

    onChange(actualValue);
    setOwnValue(actualValue);
  };

  const handleKeyDownInput = (event: KeyboardEvent<HTMLInputElement>) => {
    const ALLOWED_CHARS = ["Tab", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "-", ".", ","];

    if (Number.isNaN(Number(event.key)) && !ALLOWED_CHARS.includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <BaseInputField
      {...otherProps}
      autoFocus={autoFocus}
      value={ownValue}
      label={label}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ onKeyDown: handleKeyDownInput }}
    />
  );
};
