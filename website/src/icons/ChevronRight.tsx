import React, { type CSSProperties, type FunctionComponent } from "react";
import BaseIcon from "./BaseIcon";

interface Props {
  width?: number | string;
  height?: number | string;
  stroke?: string;
  fill?: string;
  style?: CSSProperties;
}

const ChevronRight: FunctionComponent<Props> = ({ width, height, stroke, fill, style }) => {
  return (
    <BaseIcon width={width} height={height} viewbox="0 0 24 24" style={style} stroke={stroke} fill={fill}>
      <path d="M8 24L18 12L8 0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
};

export default ChevronRight;
