import { type FunctionComponent, useState } from "react";
import { type z } from "zod";

import { SongSchema } from "@entities/song";
import { Button, FixedSideMenu, TextField } from "src/components";

type Props = {
  onAdd: (name: string, artist: string) => void;
  onClose: () => void;
};

const ValuesSchema = SongSchema.pick({ name: true, artist: true });
type Values = z.infer<typeof ValuesSchema>;

const SongMenu: FunctionComponent<Props> = ({ onAdd, onClose }) => {
  const [values, setValues] = useState<Partial<Values>>({});
  const parseResult = ValuesSchema.safeParse(values);
  const parseErrors = !parseResult.success
    ? parseResult.error.formErrors.fieldErrors
    : {};

  const handleClickAdd = () => {
    if (!parseResult.success) return;

    const parsedData = parseResult.data;
    onAdd(parsedData.name, parsedData.artist);
  };

  return (
    <FixedSideMenu label="Song Menu" rightSide onClose={onClose}>
      <div className="flex flex-col bg-inherit">
        <div className="m-auto mb-2 mt-2 flex w-full justify-center">
          <h3 className="m-auto">New Song</h3>
        </div>
        <TextField
          autoFocus
          label="Name"
          value={values.name}
          errors={parseErrors.name}
          onChange={value => setValues({ ...values, name: value })}
          className="mt-4 w-1/2 self-center"
        />
        <TextField
          label="Artist"
          value={values.artist}
          errors={parseErrors.artist}
          onChange={value => setValues({ ...values, artist: value })}
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

export default SongMenu;
