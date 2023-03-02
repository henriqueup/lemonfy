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
      <div className="flex flex-col">
        <div className="m-auto mt-2 mb-2 flex w-full justify-center">
          <h3 className="m-auto">New Bar</h3>
        </div>
        <fieldset className="mt-4 w-1/2 self-center">
          <legend>Number of Beats</legend>
          <input type="number" value={beatCount} onChange={event => setBeatCount(Number(event.target.value))} />
        </fieldset>
        <fieldset className="mt-4 w-1/2 self-center">
          <legend>Dibobinador</legend>
          <input type="number" value={dibobinador} onChange={event => setDibobinador(Number(event.target.value))} />
        </fieldset>
        <fieldset className="mt-4 w-1/2 self-center">
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
