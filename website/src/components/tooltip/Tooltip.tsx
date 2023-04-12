import { type ReactNode, type FunctionComponent, useState } from "react";
import { FloatingContainer } from "src/components/floatingContainer";

interface Props {
  content: ReactNode;
  children: ReactNode;
}

const Tooltip: FunctionComponent<Props> = ({ content, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!content) return <>{children}</>;

  return (
    <>
      <div className="relative bg-inherit" onMouseEnter={handleMouseEnter} onMouseLeave={handleClose}>
        {children}
        <FloatingContainer className="z-50 bg-inherit" isOpen={true} onClose={handleClose}>
          {content}
        </FloatingContainer>
      </div>
    </>
  );
};

export default Tooltip;
