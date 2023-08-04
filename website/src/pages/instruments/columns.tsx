import { type ColumnDef } from "@tanstack/react-table";

import { type InstrumentInfo } from "@/server/entities/instrument";
import InstrumentTableRowActions from "@/pages/instruments/InstrumentTableRowActions";
import { DataTableColumnHeader } from "@/components/ui/DataTable/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/Checkbox";
import { type ColumnMetaData } from "@/components/ui/DataTable/DataTable";
import type { Pitch } from "@/server/entities/pitch";

export const instrumentColumns = (
  revalidateData: () => Promise<void>,
  handleEditClick: (instrument: InstrumentInfo) => void,
): ColumnDef<InstrumentInfo>[] => [
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
      <DataTableColumnHeader column={column} title="Instrument" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableMultiSort: true,
    meta: {
      headProps: { className: "ml-4" },
      cellProps: { className: "ml-4" },
    } as ColumnMetaData,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    filterFn: (row, id, value: string[]) => {
      return !value.length || value.includes(row.getValue(id));
    },
    enableMultiSort: true,
  },
  {
    accessorKey: "trackCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Track Count" />
    ),
    enableMultiSort: true,
  },
  {
    accessorKey: "tuning",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tuning" />
    ),
    cell: ({ row }) => (
      <div>
        {row
          .getValue<Pitch[]>("tuning")
          .map(pitch => pitch.key)
          .join(", ")}
      </div>
    ),
    enableMultiSort: false,
    enableSorting: false,
  },
  {
    accessorKey: "isFretted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Fretted" />
    ),
    cell: ({ row }) => <Checkbox checked={row.getValue("isFretted")} />,
    enableMultiSort: false,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <InstrumentTableRowActions
        instrument={row.original}
        table={table}
        revalidateData={revalidateData}
        onEditClick={handleEditClick}
      />
    ),
    meta: {
      headProps: { className: "mr-4 w-[5%]" },
      cellProps: { className: "mr-4 w-[5%]" },
    } as ColumnMetaData,
  },
];
