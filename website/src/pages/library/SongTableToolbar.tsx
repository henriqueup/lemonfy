import { Plus } from "lucide-react";
import { useRouter } from "next/router";

import { TextField } from "@/components";
import { Button } from "@/components/ui/Button";
import { type DataTableToolbarProps } from "@/components/ui/DataTable/DataTable";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { type SongInfo } from "@/server/entities/song";

function SongTableToolbar({
  globalFilter,
  setGlobalFilter,
  table,
}: DataTableToolbarProps<SongInfo>) {
  const router = useRouter();

  const handleChangeSongSelection = (checked: boolean) => {
    table.getColumn("select")?.toggleVisibility(checked);

    if (!checked) {
      table
        .getFilteredSelectedRowModel()
        .rows.forEach(row => row.toggleSelected(false));
    }
  };

  const handleClickNewSong = () => {
    void router.push("/editor");
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <TextField
          label="Filter"
          placeholder="Filter by song name or artist..."
          value={globalFilter}
          onChange={event => setGlobalFilter(event ?? "")}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <Button
        variant="success"
        className="flex w-40 items-center gap-2"
        onClick={handleClickNewSong}
      >
        New Song
        <Plus />
      </Button>
      <div className="flex w-40 items-center space-x-2 rounded-lg border p-2">
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
