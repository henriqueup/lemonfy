import React, { type FunctionComponent, type ReactNode } from "react";

interface Props {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  viewbox: string;
  stroke?: string;
  fill?: string;
  className?: string;
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
  className,
  children,
}) => {
  return (
    <svg
      role="img"
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={viewbox}
      className={className}
      stroke={stroke}
      fill={fill}
    >
      {children}
    </svg>
  );
};

export default BaseIcon;
