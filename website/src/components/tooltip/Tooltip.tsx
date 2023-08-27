import {
  type ReactNode,
  type FunctionComponent,
  useState,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from "react";
import { FloatingContainer } from "src/components/floatingContainer";
import { cn } from "src/styles/utils";

interface Props {
  content: ReactNode;
  children: ReactNode;
}

const Tooltip: FunctionComponent<
  Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ content, children, ...otherProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!children) return null;

  return (
    <div
      {...otherProps}
      className={cn(otherProps.className, "relative")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleClose}
    >
      {children}
      {content ? (
        <FloatingContainer
          className="z-20"
          isOpen={isOpen}
          onClose={handleClose}
        >
          {content}
        </FloatingContainer>
      ) : null}
    </div>
  );
};

export default Tooltip;
