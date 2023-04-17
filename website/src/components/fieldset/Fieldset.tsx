import { type FunctionComponent, type FieldsetHTMLAttributes, type ReactNode } from "react";
import { classNames } from "src/styles/utils";

interface Props {
  label: string;
  shrinkLabel: boolean;
  hasError?: boolean;
  children: ReactNode;
}

const Fieldset: FunctionComponent<Props & FieldsetHTMLAttributes<HTMLFieldSetElement>> = ({
  label,
  shrinkLabel,
  hasError = false,
  children,
  ...otherProps
}) => {
  return (
    <fieldset
      {...otherProps}
      className={classNames(
        "relative rounded-lg border border-solid bg-inherit pl-1 pr-1",
        hasError
          ? "border-red-600 text-red-600 dark:border-red-600 dark:text-red-600"
          : "border-stone-600 text-stone-600 dark:border-stone-400 dark:text-stone-400",
        otherProps.className,
      )}
    >
      {shrinkLabel ? (
        <legend
          role="presentation"
          className={classNames(
            "absolute z-10 bg-inherit text-sm",
            "-top-[calc(theme(fontSize.sm[1].lineHeight)_/_2)]",
          )}
        >
          {label}
        </legend>
      ) : null}
      {children}
    </fieldset>
  );
};

export default Fieldset;
