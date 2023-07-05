import { type ColumnDef } from "@tanstack/react-table";

import { type SongInfo } from "@/server/entities/song";
import SongTableRowActions from "@/pages/library/SongTableRowActions";
import { DataTableColumnHeader } from "@/components/ui/DataTable/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/Checkbox";
import { type ColumnMetaData } from "@/components/ui/DataTable/DataTable";

export const songColumns = (
  revalidateData: () => Promise<void>,
): ColumnDef<SongInfo>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: true,
    meta: {
      headProps: {
        className: "ml-4 w-[5%]",
      },
      cellProps: {
        className: "ml-4 w-[5%]",
        onClick: event => event.stopPropagation(),
      },
    } as ColumnMetaData,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Song" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableMultiSort: true,
    meta: {
      headProps: { className: "ml-4" },
      cellProps: { className: "ml-4" },
    } as ColumnMetaData,
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
    cell: ({ row, table }) => (
      <SongTableRowActions
        song={row.original}
        table={{ ...table, revalidateData }}
      />
    ),
    meta: {
      headProps: { className: "mr-4 w-[5%]" },
      cellProps: { className: "mr-4 w-[5%]" },
    } as ColumnMetaData,
  },
];
