import { TextField } from "@/components";
import { type DataTableToolbarProps } from "@/components/ui/DataTable/DataTable";

function SongTableToolbar({
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <TextField
          label="Filter"
          placeholder="Filter by song name or artist..."
          value={globalFilter}
          onChange={event => setGlobalFilter(event ?? "")}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

export default SongTableToolbar;
