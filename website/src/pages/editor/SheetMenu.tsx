import { type FunctionComponent, useState } from "react";
import { Button, FixedSideMenu, NumberField } from "src/components";

type Props = {
  onAdd: (trackCount: number) => void;
  onClose: () => void;
};

const SheetMenu: FunctionComponent<Props> = ({ onAdd, onClose }) => {
  const [trackCount, setTrackCount] = useState<number | undefined>();
  const canAdd = trackCount !== undefined;

  const handleClickAdd = () => {
    if (!canAdd) return;

    onAdd(trackCount);
  };

  return (
    <FixedSideMenu label="Sheet Menu" rightSide onClose={onClose}>
      <div className="flex flex-col bg-inherit">
        <div className="m-auto mt-2 mb-2 flex w-full justify-center">
          <h3 className="m-auto">New Sheet</h3>
        </div>
        <NumberField
          label="Number of Tracks"
          value={trackCount}
          autoFocus
          onChange={value => setTrackCount(value)}
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

export default SheetMenu;
