import React, { type FunctionComponent, type ReactNode } from "react";
import { classNames } from "src/styles/utils";

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
  stroke = "currentColor",
  fill = "currentColor",
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
      className={classNames("text-inherit", className)}
      stroke={stroke}
      fill={fill}
    >
      {children}
    </svg>
  );
};

export default BaseIcon;
