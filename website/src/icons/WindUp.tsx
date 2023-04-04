import React, { type FunctionComponent } from "react";
import BaseIcon from "./BaseIcon";

interface Props {
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

const WindUp: FunctionComponent<Props> = ({ width, height, stroke, strokeWidth = 3, className }) => {
  return (
    <BaseIcon width={width} height={height} viewbox="0 0 24 24" className={className} stroke={stroke} fill={stroke}>
      <path d="M0 3L13 12L0 21L0 3" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3L23 12L12 21L12 3" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
};

export default WindUp;
