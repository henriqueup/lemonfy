import { type DataTableToolbarProps } from "@/components/ui/DataTable/DataTable";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { type SongInfo } from "@/server/entities/song";

function SongTableToolbar({
  globalFilter,
  setGlobalFilter,
  table,
}: DataTableToolbarProps<SongInfo>) {
  const handleChangeSongSelection = (checked: boolean) => {
    table.getColumn("select")?.toggleVisibility(checked);

    if (!checked) {
      table
        .getFilteredSelectedRowModel()
        .rows.forEach(row => row.toggleSelected(false));
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          title="Filter by song name or artist"
          placeholder="Filter"
          value={globalFilter}
          onChange={event => setGlobalFilter(event.target.value)}
          className="w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="flex items-center space-x-2 rounded-lg border p-2">
        <Switch
          id="song-selection"
          onCheckedChange={handleChangeSongSelection}
        />
        <Label htmlFor="song-selection">Song Selection</Label>
      </div>
    </div>
  );
}

export default SongTableToolbar;
