import { type ColumnDef } from "@tanstack/react-table";

import { type SongInfo } from "@/server/entities/song";
import SongTableRowActions from "@/pages/library/SongTableRowActions";
import { DataTableColumnHeader } from "@/components/ui/DataTable/DataTableColumnHeader";

export const songColumns: ColumnDef<SongInfo>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Song" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableMultiSort: true,
    meta: { headClassName: "ml-4", cellClassName: "ml-4" },
  },
  {
    accessorKey: "artist",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Artist" />
    ),
    enableMultiSort: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <SongTableRowActions song={row.original} />,
    meta: { headClassName: "mr-4 w-[5%]", cellClassName: "mr-4 w-[5%]" },
  },
];
