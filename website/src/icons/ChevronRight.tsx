import React, { type FunctionComponent } from "react";
import BaseIcon from "./BaseIcon";

interface Props {
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  className?: string;
}

const ChevronRight: FunctionComponent<Props> = ({ width, height, stroke, strokeWidth = 3, fill, className }) => {
  return (
    <BaseIcon width={width} height={height} viewbox="0 0 24 24" className={className} stroke={stroke} fill={fill}>
      <path d="M8 24L18 12L8 0" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
};

export default ChevronRight;
