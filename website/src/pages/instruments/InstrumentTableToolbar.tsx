import { TextField } from "@/components";
import { type DataTableToolbarProps } from "@/components/ui/DataTable/DataTable";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { type InstrumentInfo } from "@/server/entities/instrument";

function InstrumentTableToolbar({
  globalFilter,
  setGlobalFilter,
  table,
}: DataTableToolbarProps<InstrumentInfo>) {
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
        <TextField
          label="Filter"
          placeholder="Filter by instrument name..."
          value={globalFilter}
          onChange={event => setGlobalFilter(event ?? "")}
          className="h-8 w-[150px] lg:w-[250px]"
        />
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
