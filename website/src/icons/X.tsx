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

const X: FunctionComponent<Props> = ({ width, height, stroke, strokeWidth = 3, fill, className }) => {
  return (
    <BaseIcon width={width} height={height} viewbox="0 0 24 24" className={className} stroke={stroke} fill={fill}>
      <path d="M20 4L4 20M4 4L20 20" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
};

export default X;
