import { zodResolver } from "@hookform/resolvers/zod";
import { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { type Song, SongSchema } from "@entities/song";
import { FixedSideMenu } from "src/components";
import { InstrumentSchema } from "@/server/entities/instrument";
import InstrumentFields from "@/pages/editor/InstrumentFields";
import { Button } from "@/components/ui/Button";

export const SongFormSchema = SongSchema.pick({
  name: true,
  artist: true,
}).extend({ instrument: InstrumentSchema.optional() });

export type SongForm = z.infer<typeof SongFormSchema>;

const defaultValues: SongForm = {
  name: "",
  artist: "",
};

type Props = {
  loadedSong?: Song;
  onSave: (songForm: SongForm) => void;
  onClose: () => void;
};

const SongMenu: FunctionComponent<Props> = ({
  loadedSong,
  onSave,
  onClose,
}) => {
  const form = useForm<SongForm>({
    resolver: zodResolver(SongFormSchema),
    values: loadedSong ?? defaultValues,
    defaultValues,
  });

  const handleSubmit = (formValues: SongForm) => {
    onSave(formValues);
  };

  return (
    <FixedSideMenu label="Song Menu" rightSide onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="m-auto mb-2 mt-2 flex w-full justify-center">
          <h3 className="m-auto">
            {loadedSong === undefined ? "Create Song" : "Edit Song"}
          </h3>
        </div>
        <div className="mt-5 flex w-3/4 flex-col items-center gap-5">
          <Form {...form}>
            <form
              onSubmit={event => void form.handleSubmit(handleSubmit)(event)}
              className="w-full space-y-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist</FormLabel>
                    <FormControl>
                      <Input placeholder="Artist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-2">
                {loadedSong ? (
                  <Button className="w-1/2" type="submit" variant="success">
                    Save
                  </Button>
                ) : (
                  <InstrumentFields
                    onSubmit={instrument =>
                      handleSubmit({ ...form.getValues(), instrument })
                    }
                    submitButtonLabel="Save"
                  />
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </FixedSideMenu>
  );
};

export default SongMenu;
