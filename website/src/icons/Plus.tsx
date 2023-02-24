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

const Plus: FunctionComponent<Props> = ({ width, height, stroke, strokeWidth = 3, fill, className }) => {
  return (
    <BaseIcon width={width} height={height} viewbox="0 0 24 24" className={className} stroke={stroke} fill={fill}>
      <path d="M4 12L20 12M12 20L12 4" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
};

export default Plus;
