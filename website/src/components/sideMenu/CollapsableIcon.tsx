import { type FunctionComponent } from "react";
import { ChevronLeft } from "../../icons";
import { ChevronRight } from "../../icons";

type Props = {
  isOpen: boolean;
  rightSide?: boolean;
};

const CollapsableIcon: FunctionComponent<Props> = ({ isOpen, rightSide }) => {
  return (rightSide && isOpen) || (!rightSide && !isOpen) ? (
    <ChevronRight width={16} height={16} stroke="lightgray" />
  ) : (
    <ChevronLeft width={16} height={16} stroke="lightgray" />
  );
};

export default CollapsableIcon;
