import { type FunctionComponent, useState } from "react";
import { type z } from "zod";

import { type Song, SongSchema } from "@entities/song";
import { Button, FixedSideMenu, TextField } from "src/components";

type Props = {
  loadedSong?: Song;
  onSave: (name: string, artist: string) => void;
  onClose: () => void;
};

const ValuesSchema = SongSchema.pick({ name: true, artist: true });
type Values = z.infer<typeof ValuesSchema>;

const SongMenu: FunctionComponent<Props> = ({
  loadedSong,
  onSave,
  onClose,
}) => {
  const [isDirty, setIsDirty] = useState(false);
  const [values, setValues] = useState<Partial<Values>>(loadedSong ?? {});
  const parseResult = ValuesSchema.safeParse(values);
  const parseErrors = !parseResult.success
    ? parseResult.error.formErrors.fieldErrors
    : {};

  const handleClickSave = () => {
    if (!parseResult.success) return;

    const parsedData = parseResult.data;
    onSave(parsedData.name, parsedData.artist);
  };

  const handleChangeValue = <T,>(field: keyof Values, value: T) => {
    setValues({ ...values, [field]: value });
    setIsDirty(true);
  };

  return (
    <FixedSideMenu label="Song Menu" rightSide onClose={onClose}>
      <div className="flex flex-col">
        <div className="m-auto mb-2 mt-2 flex w-full justify-center">
          <h3 className="m-auto">
            {loadedSong === undefined ? "Create Song" : "Edit Song"}
          </h3>
        </div>
        <TextField
          autoFocus
          label="Name"
          value={values.name}
          errors={parseErrors.name}
          onChange={value => handleChangeValue("name", value)}
          className="mt-4 w-1/2 self-center"
        />
        <TextField
          label="Artist"
          value={values.artist}
          errors={parseErrors.artist}
          onChange={value => handleChangeValue("artist", value)}
          className="mt-4 w-1/2 self-center"
        />
        <Button
          variant="success"
          text="Save"
          disabled={!parseResult.success || !isDirty}
          onClick={handleClickSave}
          className="mt-6 w-2/5 self-center"
        />
      </div>
    </FixedSideMenu>
  );
};

export default SongMenu;
