import { FunctionComponent, useState } from "react";
import { Button } from "../../components/button/button";

type Props = {
  onAdd: (trackCount: number) => void;
};

const SheetMenu: FunctionComponent<Props> = ({ onAdd }) => {
  const [trackCount, setTrackCount] = useState<number | undefined>(undefined);
  const canAdd = trackCount !== undefined;

  const handleClickAdd = () => {
    if (!canAdd) return;

    onAdd(trackCount);
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
          style={{ width: "30%", alignSelf: "center", marginTop: "24px" }}
        />
      </div>
    </div>
  );
};

export default SheetMenu;
