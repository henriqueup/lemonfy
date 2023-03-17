import { type FunctionComponent } from "react";
import { ChevronLeft, ChevronRight } from "src/icons";
import { classNames } from "src/styles/utils";

type Props = {
  isOpen: boolean;
  rightSide?: boolean;
  menuLabel: string;
  onClick: () => void;
};

const CollapseButton: FunctionComponent<Props> = ({ isOpen, rightSide, menuLabel, onClick }) => {
  return (
    <div
      role="button"
      aria-label={isOpen ? `Close ${menuLabel}` : `Open ${menuLabel}`}
      className={classNames(
        "absolute top-[calc(50%_-_16px)] flex h-8 w-6 cursor-pointer items-center justify-center rounded border border-gray-400 bg-inherit",
        rightSide ? "border-r-0" : "border-l-0",
        rightSide ? "right-full" : "left-full",
      )}
      onClick={onClick}
    >
      {(rightSide && isOpen) || (!rightSide && !isOpen) ? (
        <ChevronRight width={16} height={16} stroke="lightgray" />
      ) : (
        <ChevronLeft width={16} height={16} stroke="lightgray" />
      )}
    </div>
  );
};

export default CollapseButton;
