import { type FunctionComponent, useState } from "react";
import { Button, FixedSideMenu, NumberField } from "src/components";

type Props = {
  onAdd: (beatCount: number, dibobinador: number, tempo: number) => void;
  onClose: () => void;
};

const BarMenu: FunctionComponent<Props> = ({ onAdd, onClose }) => {
  const [beatCount, setBeatCount] = useState<number | undefined>();
  const [dibobinador, setDibobinador] = useState<number | undefined>();
  const [tempo, setTempo] = useState<number | undefined>();
  const canAdd = beatCount !== undefined && dibobinador !== undefined && tempo !== undefined;

  const handleClickAdd = () => {
    if (!canAdd) return;

    onAdd(beatCount, dibobinador, tempo);
  };

  return (
    <FixedSideMenu label="Bar Menu" rightSide onClose={onClose}>
      <div className="flex flex-col bg-inherit">
        <div className="m-auto mt-2 mb-2 flex w-full justify-center">
          <h3 className="m-auto">New Bar</h3>
        </div>
        <NumberField
          autoFocus
          label="Number of Beats"
          value={beatCount}
          onChange={value => setBeatCount(value)}
          className="mt-4 w-1/2 self-center"
        />
        <NumberField
          label="Dibobinador"
          value={dibobinador}
          onChange={value => setDibobinador(value)}
          className="mt-4 w-1/2 self-center"
        />
        <NumberField
          label="Tempo"
          value={tempo}
          onChange={value => setTempo(value)}
          className="mt-4 w-1/2 self-center"
        />
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
