import { type ReactNode, type FunctionComponent, useState, useCallback } from "react";
import { ClickAwayListener } from "src/components";
import { X } from "src/icons";
import { classNames } from "src/styles/utils";
import CollapseButton from "./CollapseButton";

interface Props {
  rightSide?: boolean;
  initiateOpen?: boolean;
  collapsable?: boolean;
  onClose?: () => void;
  label?: string;
  children: ReactNode;
}

const BaseSideMenu: FunctionComponent<Props> = ({
  rightSide,
  initiateOpen = false,
  collapsable = true,
  onClose,
  label = "Side Menu",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(initiateOpen);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleClickAway = useCallback(() => {
    if (collapsable) setIsOpen(false);
  }, [collapsable]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        aria-label={label}
        className={classNames(
          "absolute top-0 h-screen rounded bg-inherit",
          rightSide ? "right-0 border-l border-l-gray-400" : "left-0 border-r border-r-gray-400",
          isOpen ? "w-1/4" : "border-r-0 border-l-0",
        )}
      >
        {isOpen && !collapsable ? (
          <div
            role="button"
            aria-label={`Close ${label}`}
            className="absolute top-2 right-2 cursor-pointer p-1"
            onClick={handleClose}
          >
            <X height={24} width={24} stroke="lightgray" />
          </div>
        ) : null}
        {isOpen ? children : null}
        {collapsable ? (
          <CollapseButton
            isOpen={isOpen}
            rightSide={rightSide}
            menuLabel={label}
            onClick={() => setIsOpen(current => !current)}
          />
        ) : null}
      </div>
    </ClickAwayListener>
  );
};

interface CollapsableSideMenuProps {
  rightSide?: boolean;
  label?: string;
  children: ReactNode;
}

export const CollapsableSideMenu: FunctionComponent<CollapsableSideMenuProps> = ({ rightSide, label, children }) => {
  return (
    <BaseSideMenu label={label} rightSide={rightSide}>
      {children}
    </BaseSideMenu>
  );
};

interface FixedSideMenuProps {
  rightSide?: boolean;
  label?: string;
  onClose: () => void;
  children: ReactNode;
}

export const FixedSideMenu: FunctionComponent<FixedSideMenuProps> = ({ rightSide, label, onClose, children }) => {
  return (
    <BaseSideMenu label={label} rightSide={rightSide} initiateOpen collapsable={false} onClose={onClose}>
      {children}
    </BaseSideMenu>
  );
};
