import { type ReactNode, type FunctionComponent, type DetailedHTMLProps, type HTMLAttributes } from "react";
import { classNames } from "src/styles/utils";

export type Props = {
  children?: ReactNode;
};

const ButtonContainer: FunctionComponent<Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({
  onClick,
  className,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      role="button"
      className={classNames("cursor-pointer rounded-full bg-gray-400 bg-opacity-0 p-1 hover:bg-opacity-20", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ButtonContainer;
