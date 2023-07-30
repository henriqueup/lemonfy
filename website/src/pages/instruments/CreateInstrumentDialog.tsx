import { type FunctionComponent, useMemo, useState } from "react";
import type { z } from "zod";
import { ChevronsUpDown, Info, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { parseNumber } from "@/utils/numbers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/styles/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  BaseInstrumentSchema,
  instrumentRefineCallback,
} from "@/server/entities/instrument";
import {
  FrequencyDictionary,
  createPitchFromKey,
} from "@/server/entities/pitch";
import { api } from "@/utils/api";
import { setGlobalLoading } from "@/store/global/globalActions";
import { toast } from "@/hooks/useToast";

const FormSchema = BaseInstrumentSchema.omit({ id: true }).superRefine(
  instrumentRefineCallback,
);
type Form = z.infer<typeof FormSchema>;

const defaultValues: Form = {
  name: "",
  type: "String",
  trackCount: 6,
  isFretted: true,
  tuning: [],
};

const CreateInstrumentDialog: FunctionComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const form = useForm<Form>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const createInstrumentMutation = api.instrument.save.useMutation({
    useErrorBoundary: error => !error.data?.isBusinessException,
    onSettled: () => setGlobalLoading(false),
    onError: error => {
      if (error.data?.isBusinessException)
        toast({
          variant: "destructive",
          title: error.message,
        });
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Instrument created successfully.",
      });
      setIsDialogOpen(false);
    },
  });

  const tunings = useMemo(() => {
    const pitchKeys = Object.keys(FrequencyDictionary).filter(
      key => key.charAt(0) !== "X",
    );

    return pitchKeys.map(key => ({
      label: key,
      value: createPitchFromKey(key),
    }));
  }, []);

  const isTuningSelected = (tuning: (typeof tunings)[number]): boolean => {
    const currentTuning = form.getValues().tuning;

    return currentTuning.find(t => t.key === tuning.value.key) !== undefined;
  };

  const handleSelectTuning = (tuning: (typeof tunings)[number]) => {
    const currentValues = form.getValues();

    if (isTuningSelected(tuning)) {
      form.setValue(
        "tuning",
        currentValues.tuning.filter(t => t.key !== tuning.value.key),
      );
      return;
    }

    if (
      (currentValues.type !== "Key" &&
        currentValues.tuning.length < currentValues.trackCount) ||
      currentValues.tuning.length === 0
    ) {
      form.setValue("tuning", currentValues.tuning.concat([tuning.value]));
    }
  };

  const handleSelectType = (
    type: z.infer<typeof BaseInstrumentSchema.shape.type>,
  ) => {
    form.setValue("tuning", []);
    form.setValue("type", type);
  };

  const handleSubmit = (values: Form) => {
    setGlobalLoading(true);
    createInstrumentMutation.mutate(values);
  };

  return (
    <Dialog onOpenChange={() => form.reset(defaultValues)} open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="success" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> Create Instrument
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={event => void form.handleSubmit(handleSubmit)(event)}
            className="space-y-8"
          >
            <DialogHeader>
              <DialogTitle>Create an Instrument</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="'Acoustic 6 strings Guitar in E Standard'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name that describes the Instrument.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-start space-x-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={handleSelectType}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Key">Key</SelectItem>
                        <SelectItem value="Wind" disabled>
                          Wind
                        </SelectItem>
                        <SelectItem value="Percussion" disabled>
                          Percussion
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This is the general classification or family of the
                      Instrument.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trackCount"
                render={({ field }) => (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormItem className="w-1/3">
                          <FormLabel>Track Count</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={event =>
                                field.onChange(
                                  parseNumber(
                                    event.target.value,
                                    defaultValues.trackCount,
                                  ),
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription className="flex">
                            {`This is the number of "tracks" the Instrument has.`}
                            <Info className="h-6 w-6" />
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-lg">
                        {`An Instrument's "track" is one of it's channels to produce sound, for example the string in a guitar or a key in a piano.`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              />
              <FormField
                control={form.control}
                name="isFretted"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Is Fretted</FormLabel>
                    <div className="flex flex-row items-end space-x-3 space-y-0 pb-3 pt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="leading-none">
                        <FormLabel>Is an Instrument with frets</FormLabel>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tuning"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tuning</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value.length
                            ? field.value.map(pitch => pitch.key).join(", ")
                            : "Select tuning"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search tuning..." />
                        <CommandEmpty>No tuning found.</CommandEmpty>
                        <CommandList>
                          {tunings.map(tuning => (
                            <CommandItem
                              value={tuning.label}
                              key={tuning.label}
                              onSelect={() => handleSelectTuning(tuning)}
                            >
                              <span
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isTuningSelected(tuning)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              >
                                {field.value
                                  .map(t => t.key)
                                  .indexOf(tuning.value.key) + 1}
                              </span>
                              {tuning.label}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {`These are the pitches of each Instrument "track". Instruments of type 'Key' use just a base pitch for the first key and the others follow chromatically.`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInstrumentDialog;
