import React, { type FunctionComponent } from "react";
import BaseIcon from "./BaseIcon";

interface Props {
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

const ChevronDown: FunctionComponent<Props> = ({ width, height, stroke, strokeWidth = 3, className }) => {
  return (
    <BaseIcon
      width={width}
      height={height}
      viewbox="0 0 24 24"
      className={className}
      stroke={stroke}
      fill="transparent"
    >
      <path d="M0 6L12 16L24 6" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
};

export default ChevronDown;
