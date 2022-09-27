import styled from "@emotion/styled";
import type { NextPage } from "next";
import { FunctionComponent, useEffect, useState, useRef } from "react";

const BarUi: NextPage = () => {
  const counter = useRef(0);
  const bars = useRef<number[]>([]);
  const [stateBars, setStateBars] = useState<number[]>([]);

  useEffect(() => {
    function windowClickEventFunc() {
      bars.current.push(counter.current++);
      setStateBars([...bars.current]);
    }

    if (window) {
      window.addEventListener("click", windowClickEventFunc);
      return () => {
        window.removeEventListener("click", windowClickEventFunc);
      };
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "fit-content", display: "flex", flexDirection: "column" }}>
      {stateBars &&
        stateBars.map((bar, key: number) => {
          return <Bar key={key} />;
        })}
    </div>
  );
};

const Bar: FunctionComponent<{}> = ({}) => {
  const [beats, setBeats] = useState<number[]>();
  const bars = useRef<number[]>([]);
  const counter = useRef(0);

  const addBeat = () => {
    bars.current.push(counter.current++);
    setBeats([...bars.current]);
  };
  return (
    <StyledGridParent id="grid-container">
      <StyledGrid columns={beats?.length || 0} onClick={addBeat}>
        {beats &&
          beats.map((beat: number) => {
            return <BeatUi key={beat} />;
          })}
      </StyledGrid>
    </StyledGridParent>
  );
};

const BeatUi: FunctionComponent = ({}) => {
  return <StyledGridChild onClick={() => console.log("a")} />;
};

//This will be a beat
const StyledGridChild = styled.div<{}>`
  & {
    display: flex;
    flex-direction: row;
  }
`;

//This is a bar
const StyledGridParent = styled.div<{}>`
  & {
    padding: 10px;
    height: fit-content;
    min-height: 75px;
    background-color: lightgray;
  }
`;

//This is pretty much useless (besides looks)
const StyledGrid = styled.div<{
  columns: number;
}>`
  & {
    display: grid;
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    grid-template-rows: repeat(1, 1fr);
    min-height: 75px;
    background-color: transparent;
    width: 100%;
    gap: 5px;

    & > div {
      width: 100%;
      background-color: black;
    }
  }
`;

export default BarUi;
