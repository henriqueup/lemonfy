"use client";
import { type FunctionComponent, useState } from "react";
import type { z } from "zod";

import { BarSchema } from "@entities/bar";
import { Button, FixedSideMenu, NumberField } from "src/components";

type Props = {
  onAdd: (beatCount: number, dibobinador: number, tempo: number) => void;
  onClose: () => void;
};

const ValuesSchema = BarSchema.pick({
  beatCount: true,
  dibobinador: true,
  tempo: true,
});
type Values = z.infer<typeof ValuesSchema>;

const BarMenu: FunctionComponent<Props> = ({ onAdd, onClose }) => {
  const [values, setValues] = useState<Partial<Values>>({});
  const parseResult = ValuesSchema.safeParse(values);
  const parseErrors = !parseResult.success
    ? parseResult.error.formErrors.fieldErrors
    : {};

  const handleClickAdd = () => {
    if (!parseResult.success) return;

    const parsedData = parseResult.data;
    onAdd(parsedData.beatCount, parsedData.dibobinador, parsedData.tempo);
  };

  return (
    <FixedSideMenu label="Bar Menu" rightSide onClose={onClose}>
      <div className="flex flex-col bg-inherit">
        <div className="m-auto mb-2 mt-2 flex w-full justify-center">
          <h3 className="m-auto">New Bar</h3>
        </div>
        <NumberField
          autoFocus
          label="Number of Beats"
          value={values.beatCount}
          errors={parseErrors.beatCount}
          onChange={value => setValues({ ...values, beatCount: value })}
          className="mt-4 w-1/2 self-center"
        />
        <NumberField
          label="Dibobinador"
          value={values.dibobinador}
          errors={parseErrors.dibobinador}
          onChange={value => setValues({ ...values, dibobinador: value })}
          className="mt-4 w-1/2 self-center"
        />
        <NumberField
          label="Tempo"
          value={values.tempo}
          errors={parseErrors.tempo}
          onChange={value => setValues({ ...values, tempo: value })}
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

export default BarMenu;
