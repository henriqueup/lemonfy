import { type FunctionComponent, useState } from "react";
import { Button, FixedSideMenu } from "../../components";

type Props = {
  onAdd: (beatCount: number, dibobinador: number, tempo: number) => void;
  onClose: () => void;
};

const BarMenu: FunctionComponent<Props> = ({ onAdd, onClose }) => {
  const [beatCount, setBeatCount] = useState<number | undefined>(undefined);
  const [dibobinador, setDibobinador] = useState<number | undefined>(undefined);
  const [tempo, setTempo] = useState<number | undefined>(undefined);
  const canAdd = beatCount !== undefined && dibobinador !== undefined && tempo !== undefined;

  const handleClickAdd = () => {
    if (!canAdd) return;

    onAdd(beatCount, dibobinador, tempo);
  };

  return (
    <FixedSideMenu rightSide onClose={onClose}>
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
          className="mt-6 w-2/5 self-center"
        />
      </div>
    </FixedSideMenu>
  );
};

export default BarMenu;
