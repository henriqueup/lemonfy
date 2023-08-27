import {
  type FunctionComponent,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "src/styles/utils";

interface Props {
  label: string;
  shrinkLabel: boolean;
  hasError?: boolean;
  children: ReactNode;
}

const Fieldset: FunctionComponent<
  Props & FieldsetHTMLAttributes<HTMLFieldSetElement>
> = ({ label, shrinkLabel, hasError = false, children, ...otherProps }) => {
  return (
    <fieldset
      {...otherProps}
      role={otherProps.role ?? "group"}
      aria-label={otherProps["aria-label"] ?? label}
      className={cn(
        "relative rounded-lg border pl-1 pr-1",
        hasError &&
          "border-red-600 text-red-600 dark:border-red-600 dark:text-red-600",
        otherProps.className,
      )}
    >
      {shrinkLabel ? (
        <legend
          role="presentation"
          className={cn(
            "absolute z-10 text-sm",
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
