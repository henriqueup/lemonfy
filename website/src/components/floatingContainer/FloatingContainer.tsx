import { areParentsRelativeOrAbsolute } from "src/components/utils";
import { type ReactNode, useCallback, useRef, useState, type RefCallback } from "react";
import { ClickAwayListener } from "src/components";
import { classNames } from "src/styles/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

const RECT_PADDING = 1;

const FloatingContainer = ({ isOpen, onClose, className, children }: Props) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const containerCallbackRef = useCallback<RefCallback<HTMLDivElement>>(ref => {
    containerRef.current = ref;

    // take second parent because first is ClickAwayListener
    const parentElement = ref?.parentElement?.parentElement;
    const hasRelativeParent = parentElement && areParentsRelativeOrAbsolute(parentElement);
    const parentRect = parentElement?.getBoundingClientRect();

    if (parentRect) {
      let x = parentRect.x + RECT_PADDING;
      let y = parentRect.y + parentRect.height;
      const width = parentRect.width - RECT_PADDING * 2;
      const height = window.innerHeight - y - RECT_PADDING * 8;

      if (hasRelativeParent) {
        x -= parentRect.x;
        y -= parentRect.y;
      }

      setRect(new DOMRect(x, y, width, height));
    }
  }, []);

  if (!isOpen) return null;

  return (
    <ClickAwayListener onClickAway={onClose}>
      <div
        style={{ top: rect?.top, left: rect?.left, width: rect?.width, maxHeight: rect?.height }}
        className={classNames(className, "absolute overflow-y-auto")}
        ref={containerCallbackRef}
      >
        {children}
      </div>
    </ClickAwayListener>
  );
};

export default FloatingContainer;
