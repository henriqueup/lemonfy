import { type FunctionComponent, type FieldsetHTMLAttributes, type ReactNode } from "react";
import { classNames } from "src/styles/utils";

interface Props {
  label: string;
  shrinkLabel: boolean;
  children: ReactNode;
}

const Fieldset: FunctionComponent<Props & FieldsetHTMLAttributes<HTMLFieldSetElement>> = ({
  label,
  shrinkLabel,
  children,
  ...otherProps
}) => {
  return (
    <fieldset
      {...otherProps}
      className={classNames(
        "relative rounded-lg border border-solid border-stone-600 bg-inherit pl-1 pr-1 text-stone-600 dark:border-stone-400 dark:text-stone-400",
        otherProps.className,
      )}
    >
      {shrinkLabel ? (
        <legend
          role="presentation"
          className={classNames("absolute bg-inherit text-sm", "-top-[calc(theme(fontSize.sm[1].lineHeight)_/_2)]")}
        >
          {label}
        </legend>
      ) : null}
      {children}
    </fieldset>
  );
};

export default Fieldset;
