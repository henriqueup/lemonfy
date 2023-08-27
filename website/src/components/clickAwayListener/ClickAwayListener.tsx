import {
  useCallback,
  useEffect,
  useRef,
  type FunctionComponent,
  type ReactNode,
} from "react";

interface Props {
  onClickAway: () => void;
  children: ReactNode;
}

const ClickAwayListener: FunctionComponent<Props> = ({
  onClickAway,
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMousedown = useCallback(
    (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return;

      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onClickAway();
      }
    },
    [onClickAway],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMousedown);

    return () => document.removeEventListener("mousedown", handleMousedown);
  }, [handleMousedown]);

  return <div ref={wrapperRef}>{children}</div>;
};

export default ClickAwayListener;
