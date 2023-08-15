import { type FunctionComponent, useMemo } from "react";
import type { z } from "zod";
import { ChevronsUpDown, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  InstrumentCreateSchema,
  type InstrumentInfo,
  type InstrumentType,
} from "@/server/entities/instrument";
import {
  FrequencyDictionary,
  createPitchFromKey,
} from "@/server/entities/pitch";
import { api } from "@/utils/api";
import { setGlobalLoading } from "@/store/global/globalActions";
import { toast } from "@/hooks/useToast";

type Form = z.infer<typeof InstrumentCreateSchema>;

const defaultValues: Form = {
  name: "",
  type: "String",
  trackCount: 6,
  isFretted: true,
  tuning: [],
};

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveSuccess: (instrumentId: string) => Promise<void>;
  dataToLoad?: InstrumentInfo;
};

const CreateInstrumentDialog: FunctionComponent<Props> = ({
  isOpen,
  onOpenChange,
  onSaveSuccess,
  dataToLoad,
}) => {
  const form = useForm<Form>({
    resolver: zodResolver(InstrumentCreateSchema),
    values: dataToLoad ?? defaultValues,
    defaultValues,
  });

  const saveInstrumentMutation = api.instrument.save.useMutation({
    useErrorBoundary: error => !error.data?.isBusinessException,
    onSettled: () => setGlobalLoading(false),
    onError: error => {
      if (error.data?.isBusinessException)
        toast({
          variant: "destructive",
          title: error.message,
        });
    },
    onSuccess: async instrumentId => {
      toast({
        variant: "success",
        title: "Instrument saved successfully.",
      });
      handleOpenChange(false);
      await onSaveSuccess(instrumentId);
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

  const handleSelectType = (type: InstrumentType) => {
    form.setValue("tuning", []);
    form.setValue("type", type);

    if (type === "Key") form.setValue("isFretted", false);
  };

  const handleSubmit = (values: Form) => {
    setGlobalLoading(true);
    saveInstrumentMutation.mutate(values);
  };

  const handleOpenChange = (open: boolean) => {
    form.reset(dataToLoad ?? defaultValues);

    onOpenChange(open);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={event => void form.handleSubmit(handleSubmit)(event)}
            className="space-y-8"
          >
            <DialogHeader>
              <DialogTitle>
                {dataToLoad ? "Edit Instrument" : "Create an Instrument"}
              </DialogTitle>
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
                          checked={
                            field.value && form.getValues().type !== "Key"
                          }
                          onCheckedChange={field.onChange}
                          disabled={form.getValues().type === "Key"}
                          title={
                            form.getValues().type === "Key"
                              ? "Key Instruments can't have frets."
                              : undefined
                          }
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
                  <Popover modal>
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
                    <PopoverContent className="p-0" side="top">
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
