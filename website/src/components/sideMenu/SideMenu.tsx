import {
  type ReactNode,
  type FunctionComponent,
  useState,
  useCallback,
} from "react";
import { ClickAwayListener } from "src/components";
import { X } from "src/icons";
import { cn } from "src/styles/utils";
import CollapseButton from "./CollapseButton";

interface Props {
  rightSide?: boolean;
  isOpen?: boolean;
  onChangeIsOpen?: (value: boolean) => void;
  collapsable?: boolean;
  label?: string;
  children: ReactNode;
}

const BaseSideMenu: FunctionComponent<Props> = ({
  rightSide,
  isOpen,
  collapsable = true,
  onChangeIsOpen,
  label = "Side Menu",
  children,
}) => {
  const [ownIsOpen, setOwnIsOpen] = useState(isOpen !== undefined && isOpen);

  const checkIsOpen = () => (isOpen !== undefined ? isOpen : ownIsOpen);

  const handleChangeIsOpen = useCallback(
    (value: boolean) => {
      setOwnIsOpen(value);
      if (onChangeIsOpen) onChangeIsOpen(value);
    },
    [onChangeIsOpen],
  );

  const handleClickAway = useCallback(() => {
    if (collapsable) {
      setOwnIsOpen(false);
      handleChangeIsOpen(false);
    }
  }, [collapsable, handleChangeIsOpen]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        aria-label={label}
        className={cn(
          "fixed top-0 z-40 h-screen rounded",
          rightSide ? "right-0 border-l" : "left-0 border-r",
          checkIsOpen() ? "w-1/4" : "border-l-0 border-r-0",
        )}
      >
        {checkIsOpen() && !collapsable ? (
          <div
            role="button"
            aria-label={`Close ${label}`}
            className="absolute right-2 top-2 cursor-pointer p-1"
            onClick={() => handleChangeIsOpen(false)}
          >
            <X height={24} width={24} />
          </div>
        ) : null}
        {checkIsOpen() ? children : null}
        {collapsable ? (
          <CollapseButton
            isOpen={checkIsOpen()}
            rightSide={rightSide}
            menuLabel={label}
            onClick={() => handleChangeIsOpen(!checkIsOpen())}
          />
        ) : null}
      </div>
    </ClickAwayListener>
  );
};

interface CollapsableSideMenuProps {
  rightSide?: boolean;
  isOpen?: boolean;
  onChangeIsOpen?: (value: boolean) => void;
  label?: string;
  children: ReactNode;
}

export const CollapsableSideMenu: FunctionComponent<
  CollapsableSideMenuProps
> = ({ rightSide, isOpen, onChangeIsOpen, label, children }) => {
  return (
    <BaseSideMenu
      label={label}
      isOpen={isOpen}
      onChangeIsOpen={onChangeIsOpen}
      rightSide={rightSide}
    >
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

export const FixedSideMenu: FunctionComponent<FixedSideMenuProps> = ({
  rightSide,
  label,
  onClose,
  children,
}) => {
  return (
    <BaseSideMenu
      label={label}
      rightSide={rightSide}
      isOpen
      collapsable={false}
      onChangeIsOpen={onClose}
    >
      {children}
    </BaseSideMenu>
  );
};
