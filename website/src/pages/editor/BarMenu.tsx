import { type FunctionComponent, useState } from "react";
import { Button, FixedSideMenu, NumberField } from "src/components";

type Props = {
  onAdd: (beatCount: number, dibobinador: number, tempo: number) => void;
  onClose: () => void;
};

const BarMenu: FunctionComponent<Props> = ({ onAdd, onClose }) => {
  const [beatCount, setBeatCount] = useState<number | null>(null);
  const [dibobinador, setDibobinador] = useState<number | null>(null);
  const [tempo, setTempo] = useState<number | null>(null);
  const canAdd = beatCount !== null && dibobinador !== null && tempo !== null;
  console.log(beatCount);

  const handleClickAdd = () => {
    if (!canAdd) return;

    onAdd(beatCount, dibobinador, tempo);
  };

  return (
    <FixedSideMenu rightSide onClose={onClose}>
      <div className="flex flex-col bg-inherit">
        <div className="m-auto mt-2 mb-2 flex w-full justify-center">
          <h3 className="m-auto">New Bar</h3>
        </div>
        <NumberField
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
