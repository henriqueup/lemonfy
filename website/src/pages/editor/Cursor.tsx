import { type FunctionComponent } from "react";

interface Props {
  position: number;
  barCapacity: number;
}

const Cursor: FunctionComponent<Props> = ({ position, barCapacity }) => {
  return (
    <div
      style={{ left: `${(position * 100) / barCapacity}%` }}
      className="absolute h-full border border-solid border-lime-600"
    />
  );
};

export default Cursor;
