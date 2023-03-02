import { type FunctionComponent, useState } from "react";
import { Button, FixedSideMenu } from "../../components";

type Props = {
  onAdd: (trackCount: number) => void;
  onClose: () => void;
};

const SheetMenu: FunctionComponent<Props> = ({ onAdd, onClose }) => {
  const [trackCount, setTrackCount] = useState<number | undefined>(undefined);
  const canAdd = trackCount !== undefined;

  const handleClickAdd = () => {
    if (!canAdd) return;

    onAdd(trackCount);
  };

  return (
    <FixedSideMenu rightSide onClose={onClose}>
      <div className="flex flex-col">
        <div className="m-auto mt-2 mb-2 flex w-full justify-center">
          <h3 className="m-auto">New Sheet</h3>
        </div>
        <fieldset className="mt-4 w-1/2 self-center">
          <legend>Number of Tracks</legend>
          <input type="number" value={trackCount} onChange={event => setTrackCount(Number(event.target.value))} />
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

export default SheetMenu;
