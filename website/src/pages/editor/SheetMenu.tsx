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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", width: "100%", margin: "8px auto" }}>
          <h3 style={{ margin: "auto" }}>New Sheet</h3>
        </div>
        <fieldset style={{ width: "50%", alignSelf: "center", marginTop: "16px" }}>
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
