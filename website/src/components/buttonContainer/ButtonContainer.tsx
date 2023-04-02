import { type ReactNode, type FunctionComponent, type MouseEventHandler } from "react";
import { classNames } from "src/styles/utils";

export type Props = {
  onClick: MouseEventHandler<HTMLDivElement>;
  className?: string;
  children?: ReactNode;
};

const ButtonContainer: FunctionComponent<Props> = ({ onClick, className, children }) => {
  return (
    <div
      className={classNames("cursor-pointer rounded-full bg-gray-400 bg-opacity-0 p-1 hover:bg-opacity-20", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ButtonContainer;
