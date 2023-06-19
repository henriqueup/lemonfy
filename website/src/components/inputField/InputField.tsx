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
  type HTMLAttributes,
  type MouseEvent,
} from "react";
import X from "src/icons/X";
import { handleKeyDown } from "src/utils/htmlEvents";
import { Fieldset } from "src/components/fieldset";
import { ButtonContainer } from "src/components/buttonContainer";
import { Tooltip } from "src/components/tooltip";

interface BaseProps {
  label: string;
  value?: string | number;
  errors?: string[];
  placeholder?: string;
  disableClear?: boolean;
  autoFocus?: boolean;
  fieldsetProps?: FieldsetHTMLAttributes<HTMLFieldSetElement>;
  inputProps?: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "value" | "onChange"
  >;
}

interface GeneralProps extends BaseProps {
  onChange: (value: string | number | undefined) => void;
}

const GeneralInputField: FunctionComponent<
  GeneralProps &
    Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      "onChange"
    >
> = ({
  label,
  value,
  errors,
  placeholder,
  onChange,
  disableClear,
  inputProps,
  autoFocus = false,
  fieldsetProps,
  ...otherProps
}) => {
  const [isDirty, setIsDirty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasContent = value !== undefined && value !== "";
  const hasError = errors && isDirty;

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  const handleClear = (event: SyntheticEvent) => {
    onChange(undefined);
    event.stopPropagation();
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    setIsDirty(true);

    if (otherProps.onBlur) otherProps.onBlur(event);
  };

  const handleClickFieldset = (
    event: MouseEvent<HTMLFieldSetElement, globalThis.MouseEvent>,
  ) => {
    inputRef.current?.focus();

    if (fieldsetProps?.onClick) fieldsetProps.onClick(event);
  };

  return (
    <Tooltip
      {...otherProps}
      onBlur={handleBlur}
      content={
        hasError
          ? errors.map(error => (
              <p role="tooltip" key={error} className="text-red-600">
                {error}
              </p>
            ))
          : null
      }
    >
      <Fieldset
        {...fieldsetProps}
        label={hasContent ? label : ""}
        shrinkLabel={hasContent}
        hasError={hasError}
        onClick={event => handleClickFieldset(event)}
      >
        <div className="flex cursor-text items-center pb-2 pt-2">
          <input
            autoFocus={autoFocus}
            {...inputProps}
            placeholder={placeholder || label}
            className="w-full cursor-text bg-inherit pl-1 placeholder:text-inherit focus-visible:outline-none"
            value={value === undefined ? "" : value}
            onInput={handleChangeInput}
            onFocus={event => event.target.select()}
            tabIndex={0}
            ref={inputRef}
          />
          {hasContent && !disableClear ? (
            <ButtonContainer
              aria-label="Clear"
              onClick={event => handleClear(event)}
              onKeyDown={handleKeyDown("Enter", handleClear)}
              tabIndex={0}
            >
              <X
                width={16}
                height={16}
                strokeWidth={2}
                className={
                  hasError ? "text-red-600 dark:text-red-600" : undefined
                }
              />
            </ButtonContainer>
          ) : null}
        </div>
      </Fieldset>
    </Tooltip>
  );
};

interface TextFieldProps extends BaseProps {
  value?: string;
  onChange: (key: string | undefined) => void;
  inputProps?: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "value" | "onChange" | "type"
  >;
}

export const TextField: FunctionComponent<
  TextFieldProps &
    Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      "onChange"
    >
> = ({ label, onChange, ...otherProps }) => {
  const handleChange = (newValue: string | number | undefined) => {
    if (typeof newValue === "number") {
      onChange(newValue.toString());
      return;
    }

    onChange(newValue);
  };

  return (
    <GeneralInputField {...otherProps} label={label} onChange={handleChange} />
  );
};

interface NumberFieldProps extends BaseProps {
  value?: number;
  onChange: (key: number | undefined) => void;
  inputProps?: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "value" | "onChange" | "type"
  >;
}

export const NumberField: FunctionComponent<
  NumberFieldProps &
    Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      "onChange"
    >
> = ({ label, onChange, ...otherProps }) => {
  const [ownValue, setOwnValue] = useState<number | string | undefined>(
    otherProps.value,
  );

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
    const ALLOWED_CHARS = [
      "Tab",
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "-",
      ".",
      ",",
    ];

    if (Number.isNaN(Number(event.key)) && !ALLOWED_CHARS.includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <GeneralInputField
      {...otherProps}
      value={ownValue}
      label={label}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ ...otherProps.inputProps, onKeyDown: handleKeyDownInput }}
    />
  );
};
