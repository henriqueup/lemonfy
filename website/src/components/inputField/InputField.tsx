import {
  type ChangeEvent,
  type DetailedHTMLProps,
  type FunctionComponent,
  useRef,
  type SyntheticEvent,
  type InputHTMLAttributes,
  type FieldsetHTMLAttributes,
  type KeyboardEvent,
} from "react";
import X from "src/icons/X";
import { handleKeyDown } from "src/utils/htmlEvents";
import { Fieldset } from "src/components/fieldset";
import { iconClassName } from "src/components/utils";

interface Props {
  label: string;
  value?: string | number | null;
  isNumber?: boolean;
  placeholder?: string;
  onChange: (key: string | number | null) => void;
  disableClear?: boolean;
  inputProps?: Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "value" | "onChange">;
}

const BaseInputField: FunctionComponent<Props & Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange">> = ({
  label,
  value = null,
  isNumber = false,
  placeholder,
  onChange,
  disableClear,
  inputProps,
  ...otherProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const shrinkLabel = Boolean(value || placeholder);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (isNumber) {
      onChange(Number(newValue));
      return;
    }

    onChange(newValue);
  };

  const handleClear = (event: SyntheticEvent) => {
    onChange(null);
    event.stopPropagation();
  };

  const handleClickFieldset = () => {
    inputRef.current?.focus();
  };

  return (
    <Fieldset {...otherProps} label={label} shrinkLabel={shrinkLabel} onClick={handleClickFieldset}>
      <div className="flex cursor-pointer items-center pb-2 pt-2">
        <input
          {...inputProps}
          placeholder={placeholder || label}
          className="w-full cursor-pointer bg-inherit focus-visible:outline-none"
          value={value === null ? "" : value}
          onInput={handleChangeInput}
          onFocus={event => event.target.select()}
          tabIndex={0}
          ref={inputRef}
        />
        {value && !disableClear && (
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
    </Fieldset>
  );
};

interface TextFieldProps {
  label: string;
  value?: string | null;
  placeholder?: string;
  onChange: (key: string | null) => void;
  disableClear?: boolean;
  inputProps?: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "value" | "onChange" | "type"
  >;
}

export const TextField: FunctionComponent<
  TextFieldProps & Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange">
> = ({ label, onChange, ...otherProps }) => {
  const handleChange = (newValue: string | number | null) => {
    if (typeof newValue === "number") {
      onChange(newValue.toString());
      return;
    }

    onChange(newValue);
  };

  return <BaseInputField {...otherProps} label={label} onChange={handleChange} />;
};

interface NumberFieldProps {
  label: string;
  value?: number | null;
  placeholder?: string;
  onChange: (key: number | null) => void;
  disableClear?: boolean;
  inputProps?: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "value" | "onChange" | "type"
  >;
}

// TODO: add decimal support
export const NumberField: FunctionComponent<
  NumberFieldProps & Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange">
> = ({ label, onChange, ...otherProps }) => {
  const handleChange = (newValue: string | number | null) => {
    if (typeof newValue === "string") {
      onChange(Number(newValue));
      return;
    }

    onChange(newValue);
  };

  const handleKeyDownInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (Number.isNaN(Number(event.key))) {
      event.preventDefault();
    }
  };

  return (
    <BaseInputField
      {...otherProps}
      label={label}
      onChange={handleChange}
      isNumber
      inputProps={{ onKeyDown: handleKeyDownInput }}
    />
  );
};
