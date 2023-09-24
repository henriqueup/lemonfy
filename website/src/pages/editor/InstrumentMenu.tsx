import { type FunctionComponent } from "react";

import { FixedSideMenu } from "src/components";
import { type Instrument } from "@/server/entities/instrument";
import InstrumentFields from "@/pages/editor/InstrumentFields";

type Props = {
  onSubmit: (instrument: Instrument) => void;
  onClose: () => void;
};

const InstrumentMenu: FunctionComponent<Props> = ({ onSubmit, onClose }) => {
  return (
    <FixedSideMenu label="Instrument Menu" rightSide onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="m-auto mb-2 mt-2 flex w-full justify-center">
          <h3 className="m-auto">Add Instrument</h3>
        </div>
        <div className="mt-5 flex w-3/4 flex-col items-center gap-5">
          <InstrumentFields onSubmit={onSubmit} />
        </div>
      </div>
    </FixedSideMenu>
  );
};

export default InstrumentMenu;
