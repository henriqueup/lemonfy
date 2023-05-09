"use client";
import { type FunctionComponent, useState } from "react";

import { SheetSchema } from "@entities/sheet";
import { Button, FixedSideMenu, NumberField } from "src/components";
import { type z } from "zod";

type Props = {
  onAdd: (trackCount: number) => void;
  onClose: () => void;
};

const ValuesSchema = SheetSchema.pick({ trackCount: true });
type Values = z.infer<typeof ValuesSchema>;

const SheetMenu: FunctionComponent<Props> = ({ onAdd, onClose }) => {
  const [values, setValues] = useState<Partial<Values>>({});
  const parseResult = ValuesSchema.safeParse(values);
  const parseErrors = !parseResult.success
    ? parseResult.error.formErrors.fieldErrors
    : {};

  const handleClickAdd = () => {
    if (!parseResult.success) return;

    const parsedData = parseResult.data;
    onAdd(parsedData.trackCount);
  };

  return (
    <FixedSideMenu label="Sheet Menu" rightSide onClose={onClose}>
      <div className="flex flex-col bg-inherit">
        <div className="m-auto mb-2 mt-2 flex w-full justify-center">
          <h3 className="m-auto">New Sheet</h3>
        </div>
        <NumberField
          autoFocus
          label="Number of Tracks"
          value={values.trackCount}
          errors={parseErrors.trackCount}
          onChange={value => setValues({ ...values, trackCount: value })}
          className="mt-4 w-1/2 self-center"
        />
        <Button
          variant="success"
          text="Add"
          disabled={!parseResult.success}
          onClick={handleClickAdd}
          className="mt-6 w-2/5 self-center"
        />
      </div>
    </FixedSideMenu>
  );
};

export default SheetMenu;
