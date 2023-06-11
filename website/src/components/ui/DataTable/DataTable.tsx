import { useState, type MouseEvent } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type Row,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { DataTablePagination } from "@/components/ui/DataTable/DataTablePagination";

type Meta = {
  cellClassName?: string;
  headClassName?: string;
};

interface RowProps<TData> {
  onClick?: (event: MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  className?: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowProps?: RowProps<TData>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowProps,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="hover:bg-inherit">
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={
                      (header.column.columnDef.meta as Meta)?.headClassName
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  {...rowProps}
                  onClick={
                    rowProps?.onClick
                      ? event => rowProps.onClick?.(event, row)
                      : undefined
                  }
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={
                        (cell.column.columnDef.meta as Meta)?.cellClassName
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
