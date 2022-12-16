import { FunctionComponent, useState } from "react";
import { Button } from "../../components/button/button";

type Props = {
  onAdd: (beatCount: number, dibobinador: number, tempo: number) => void;
};

const BarMenu: FunctionComponent<Props> = ({ onAdd }) => {
  const [beatCount, setBeatCount] = useState<number | undefined>(undefined);
  const [dibobinador, setDibobinador] = useState<number | undefined>(undefined);
  const [tempo, setTempo] = useState<number | undefined>(undefined);
  const canAdd = beatCount !== undefined && dibobinador !== undefined && tempo !== undefined;

  const handleClickAdd = () => {
    if (!canAdd) return;

    onAdd(beatCount, dibobinador, tempo);
  };

  return (
    <div
      style={{
        width: "25vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        right: 0,
        borderLeft: "1px solid lightgray",
        borderRadius: "4px",
        background: "inherit",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", width: "100%", margin: "8px auto" }}>
          <h3 style={{ margin: "auto" }}>New Bar</h3>
        </div>
        <fieldset style={{ width: "50%", alignSelf: "center", marginTop: "16px" }}>
          <legend>Number of Beats</legend>
          <input type="number" value={beatCount} onChange={event => setBeatCount(Number(event.target.value))} />
        </fieldset>
        <fieldset style={{ width: "50%", alignSelf: "center", marginTop: "16px" }}>
          <legend>Dibobinador</legend>
          <input type="number" value={dibobinador} onChange={event => setDibobinador(Number(event.target.value))} />
        </fieldset>
        <fieldset style={{ width: "50%", alignSelf: "center", marginTop: "16px" }}>
          <legend>Tempo</legend>
          <input type="number" value={tempo} onChange={event => setTempo(Number(event.target.value))} />
        </fieldset>
        <Button
          variant="success"
          text="Add"
          disabled={!canAdd}
          onClick={handleClickAdd}
          style={{ width: "30%", alignSelf: "center", marginTop: "24px" }}
        />
      </div>
    </div>
  );
};

export default BarMenu;
