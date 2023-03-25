import { type ReactNode, type FunctionComponent, type MouseEventHandler } from "react";

export type Props = {
  onClick: MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;
};

const ButtonContainer: FunctionComponent<Props> = ({ onClick, children }) => {
  return (
    <div className="cursor-pointer rounded-full bg-gray-400 bg-opacity-0 p-1 hover:bg-opacity-20" onClick={onClick}>
      {children}
    </div>
  );
};

export default ButtonContainer;
