import { type FunctionComponent, useState, useMemo } from "react";
import {
  Check,
  ChevronDown,
  ExternalLink,
  Loader,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import { api } from "@/utils/api";
import { type Instrument } from "@/server/entities/instrument";
import { toast } from "@/hooks/useToast";
import { Label } from "@/components/ui/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";
import { cn } from "@/styles/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import CreateInstrumentDialog from "@/pages/instruments/CreateInstrumentDialog";
import { useRouter } from "next/router";

type Props = {
  onSubmit: (instrument: Instrument) => void;
  submitButtonLabel?: string;
};

const maxInstrumentsInSearch = 10;

const InstrumentFields: FunctionComponent<Props> = ({
  onSubmit,
  submitButtonLabel = "Add to Song",
}) => {
  const router = useRouter();
  const [isInstrumentDialogOpen, setIsInstrumentDialogOpen] = useState(false);
  const [isInstrumentDropdownOpen, setIsInstrumentDropdownOpen] =
    useState(false);
  const [instrumentSearchValue, setInstrumentSearchValue] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState<
    Instrument | undefined
  >(undefined);

  const listInstrumentsQuery = api.instrument.list.useQuery(undefined, {
    onError: error => {
      toast({
        variant: "destructive",
        title: "Error when fetching Instruments",
        description: error.message,
      });
    },
  });

  const filteredInstruments = useMemo(() => {
    if (!listInstrumentsQuery.data) return [];

    return listInstrumentsQuery.data.filter(instrument =>
      instrument.name
        .toLowerCase()
        .includes(instrumentSearchValue.toLowerCase()),
    );
  }, [listInstrumentsQuery, instrumentSearchValue]);

  const handleCreateInstrumentSuccess = async (instrumentId: string) => {
    const refetchedInstruments = await listInstrumentsQuery.refetch();

    const newInstrument = refetchedInstruments.data?.find(
      instrument => instrument.id === instrumentId,
    );
    setSelectedInstrument(newInstrument);
  };

  const handleSelectInstrument = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setIsInstrumentDropdownOpen(false);
  };

  const handleClickAdd = () => {
    if (selectedInstrument === undefined) return;

    onSubmit(selectedInstrument);
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="flex w-full items-end gap-1.5">
        <div className="flex w-full flex-grow flex-col items-center gap-x-1.5 space-y-2">
          <Label htmlFor="type-filter" className="ml-1 w-full">
            Instrument
          </Label>
          <Popover
            modal
            open={isInstrumentDropdownOpen}
            onOpenChange={open => setIsInstrumentDropdownOpen(open)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !selectedInstrument && "text-muted-foreground",
                )}
                onClick={() => setIsInstrumentDropdownOpen(true)}
              >
                <span className="max-w-5/6 overflow-x-hidden text-ellipsis whitespace-nowrap">
                  {selectedInstrument
                    ? selectedInstrument.name
                    : "Select an Instrument"}
                </span>
                {listInstrumentsQuery.isLoading ? (
                  <Loader className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search Instruments..."
                  value={instrumentSearchValue}
                  onValueChange={setInstrumentSearchValue}
                />
                <CommandEmpty>No Instrument found.</CommandEmpty>
                <CommandList>
                  {filteredInstruments
                    .slice(0, maxInstrumentsInSearch)
                    .map(instrument => (
                      <CommandItem
                        value={instrument.name}
                        key={instrument.id}
                        onSelect={() => handleSelectInstrument(instrument)}
                      >
                        <span
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedInstrument?.id === instrument.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </span>
                        <span>{instrument.name}</span>
                      </CommandItem>
                    ))}
                  {filteredInstruments.length > maxInstrumentsInSearch ? (
                    <div className="flex w-full items-center justify-center">
                      <MoreHorizontal />
                    </div>
                  ) : null}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          className="px-2 py-0"
          title="New Instrument"
          onClick={() => setIsInstrumentDialogOpen(true)}
          type="button"
        >
          <Plus />
        </Button>
      </div>
      <div className="flex w-full gap-3">
        <Button
          className="w-1/2"
          variant="secondary"
          onClick={() => void router.push("/instruments")}
          type="button"
        >
          Go to Instruments <ExternalLink className="ml-2 h-5 w-5" />
        </Button>
        <Button
          className="w-1/2"
          variant="success"
          onClick={handleClickAdd}
          type="submit"
        >
          {submitButtonLabel}
        </Button>
      </div>
      <CreateInstrumentDialog
        isOpen={isInstrumentDialogOpen}
        onOpenChange={setIsInstrumentDialogOpen}
        onSaveSuccess={handleCreateInstrumentSuccess}
      />
    </div>
  );
};

export default InstrumentFields;
