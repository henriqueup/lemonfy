import React, { CSSProperties, FunctionComponent, ReactNode } from "react";

interface Props {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  viewbox: string;
  stroke?: string;
  fill?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const BaseIcon: FunctionComponent<Props> = ({
  x = 0,
  y = 0,
  width = 16,
  height = 16,
  viewbox,
  stroke = "#000000",
  fill = "#000000",
  style,
  children,
}) => {
  return (
    <svg x={x} y={y} width={width} height={height} viewBox={viewbox} style={style} stroke={stroke} fill={fill}>
      {children}
    </svg>
  );
};

export default BaseIcon;
