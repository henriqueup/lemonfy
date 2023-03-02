import { type ReactNode, type FunctionComponent, useState, useCallback } from "react";
import { X } from "../../icons";
import { classNames } from "../../styles/utils";
import ClickAwayListener from "../clickAwayListener/ClickAwayListener";
import CollapsableIcon from "./CollapsableIcon";

interface Props {
  rightSide?: boolean;
  initiateOpen?: boolean;
  collapsable?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const BaseSideMenu: FunctionComponent<Props> = ({
  rightSide,
  initiateOpen = false,
  collapsable = true,
  onClose,
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
        className={classNames(
          "absolute top-0 h-screen rounded bg-inherit",
          rightSide ? "right-0 border-l border-l-gray-400" : "left-0 border-r border-r-gray-400",
          isOpen ? "w-1/4" : "border-r-0 border-l-0",
        )}
      >
        {isOpen && !collapsable ? (
          <div className="absolute top-2 right-2 cursor-pointer p-1" onClick={handleClose}>
            <X height={24} width={24} stroke="lightgray" />
          </div>
        ) : null}
        {isOpen ? children : null}
        {collapsable ? (
          <div
            className={classNames(
              "absolute top-[calc(50%_-_16px)] flex h-8 w-6 cursor-pointer items-center justify-center rounded border border-gray-400 bg-inherit",
              rightSide ? "border-r-0" : "border-l-0",
              rightSide ? "right-full" : "left-full",
            )}
            onClick={() => setIsOpen(current => !current)}
          >
            <CollapsableIcon isOpen={isOpen} rightSide={rightSide} />
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
};

interface CollapsableSideMenuProps {
  rightSide?: boolean;
  children: ReactNode;
}

export const CollapsableSideMenu: FunctionComponent<CollapsableSideMenuProps> = ({ rightSide, children }) => {
  return <BaseSideMenu rightSide={rightSide}>{children}</BaseSideMenu>;
};

interface FixedSideMenuProps {
  rightSide?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const FixedSideMenu: FunctionComponent<FixedSideMenuProps> = ({ rightSide, onClose, children }) => {
  return (
    <BaseSideMenu rightSide={rightSide} initiateOpen collapsable={false} onClose={onClose}>
      {children}
    </BaseSideMenu>
  );
};
