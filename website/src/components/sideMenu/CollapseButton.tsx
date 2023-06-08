import { type FunctionComponent } from "react";
import { ChevronLeft, ChevronRight } from "src/icons";
import { cn } from "src/styles/utils";

type Props = {
  isOpen: boolean;
  rightSide?: boolean;
  menuLabel: string;
  onClick: () => void;
};

const CollapseButton: FunctionComponent<Props> = ({
  isOpen,
  rightSide,
  menuLabel,
  onClick,
}) => {
  return (
    <div
      role="button"
      aria-label={isOpen ? `Close ${menuLabel}` : `Open ${menuLabel}`}
      className={cn(
        "absolute top-[calc(50%_-_16px)] flex h-8 w-6 cursor-pointer items-center justify-center rounded border bg-inherit",
        rightSide ? "border-r-0" : "border-l-0",
        rightSide ? "right-full" : "left-full",
      )}
      onClick={onClick}
    >
      {(rightSide && isOpen) || (!rightSide && !isOpen) ? (
        <ChevronRight width={16} height={16} />
      ) : (
        <ChevronLeft width={16} height={16} />
      )}
    </div>
  );
};

export default CollapseButton;
