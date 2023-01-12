import React, { type CSSProperties, type FunctionComponent } from "react";
import BaseIcon from "./BaseIcon";

interface Props {
  width?: number | string;
  height?: number | string;
  stroke?: string;
  fill?: string;
  style?: CSSProperties;
}

const ChevronLeft: FunctionComponent<Props> = ({ width, height, stroke, fill, style }) => {
  return (
    <BaseIcon width={width} height={height} viewbox="0 0 24 24" style={style} stroke={stroke} fill={fill}>
      <path d="M16 0L6 12L16 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </BaseIcon>
  );
};

export default ChevronLeft;
