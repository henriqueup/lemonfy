import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { type DataTableToolbarProps } from "@/components/ui/DataTable/DataTable";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import {
  type InstrumentType,
  type InstrumentInfo,
  INSTRUMENT_TYPES,
  DISABLED_INSTRUMENT_TYPES,
} from "@/server/entities/instrument";
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

function InstrumentTableToolbar({
  globalFilter,
  setGlobalFilter,
  table,
}: DataTableToolbarProps<InstrumentInfo>) {
  const [selectedTypes, setSelectedTypes] = useState<InstrumentType[]>([]);

  const handleSelectType = (type: InstrumentType) => {
    let newTypes = selectedTypes;

    if (selectedTypes.includes(type)) {
      newTypes = selectedTypes.filter(t => t !== type);
    } else {
      newTypes = selectedTypes.concat([type]);
    }

    setSelectedTypes(newTypes);
    table.getColumn("type")?.setFilterValue(newTypes);
  };

  const handleChangeInstrumentSelection = (checked: boolean) => {
    table.getColumn("select")?.toggleVisibility(checked);

    if (!checked) {
      table
        .getFilteredSelectedRowModel()
        .rows.forEach(row => row.toggleSelected(false));
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="input-filter" className="ml-1">
            Name
          </Label>
          <Input
            id="input-filter"
            placeholder="Filter by instrument name..."
            value={globalFilter}
            onChange={event => setGlobalFilter(event.target.value)}
            className="h-[40px] w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type-filter" className="ml-1">
            Type
          </Label>
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[150px] justify-between lg:w-[250px]",
                  !selectedTypes.length && "text-muted-foreground",
                )}
              >
                {selectedTypes.length
                  ? selectedTypes.join(", ")
                  : "Select types"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="top">
              <Command>
                <CommandInput placeholder="Search types..." />
                <CommandEmpty>No type found.</CommandEmpty>
                <CommandList>
                  {INSTRUMENT_TYPES.map(type => (
                    <CommandItem
                      value={type}
                      key={type}
                      disabled={DISABLED_INSTRUMENT_TYPES.includes(type)}
                      onSelect={() => handleSelectType(type)}
                    >
                      <span
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTypes.includes(type)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                      <span
                        className={cn(
                          DISABLED_INSTRUMENT_TYPES.includes(type) &&
                            "opacity-40",
                        )}
                      >
                        {type}
                      </span>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex items-center space-x-2 rounded-lg border p-2">
        <Switch
          id="instrument-selection"
          onCheckedChange={handleChangeInstrumentSelection}
        />
        <Label htmlFor="instrument-selection">Instrument Selection</Label>
      </div>
    </div>
  );
}

export default InstrumentTableToolbar;
