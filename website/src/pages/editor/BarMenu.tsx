import { zodResolver } from "@hookform/resolvers/zod";
import { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { FixedSideMenu } from "src/components";
import { Button } from "@/components/ui/Button";

const BarFormSchema = z.object({
  beatCount: z.coerce.number().int().min(1),
  dibobinador: z.coerce.number().int().min(1),
  tempo: z.coerce.number().int().min(1),
});
type BarForm = z.infer<typeof BarFormSchema>;

type Props = {
  onAdd: (beatCount: number, dibobinador: number, tempo: number) => void;
  onClose: () => void;
};

const BarMenu: FunctionComponent<Props> = ({ onAdd, onClose }) => {
  const form = useForm<BarForm>({
    resolver: zodResolver(BarFormSchema),
  });

  const handleSubmit = (formValues: BarForm) => {
    onAdd(formValues.beatCount, formValues.dibobinador, formValues.tempo);
  };

  return (
    <FixedSideMenu label="Bar Menu" rightSide onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="m-auto mb-2 mt-2 flex w-full justify-center">
          <h3 className="m-auto">New Bar</h3>
        </div>
        <div className="mt-5 flex w-3/4 flex-col items-center">
          <Form {...form}>
            <form
              onSubmit={event => void form.handleSubmit(handleSubmit)(event)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="beatCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Beats</FormLabel>
                    <FormControl>
                      <Input {...field} autoFocus type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dibobinador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dibobinador</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tempo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-2">
                <Button className="w-1/2" type="submit" variant="success">
                  Add
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </FixedSideMenu>
  );
};

export default BarMenu;
