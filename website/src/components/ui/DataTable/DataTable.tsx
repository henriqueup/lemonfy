import { useState, type MouseEvent, type FunctionComponent } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type Row,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type Table as TableType,
  type VisibilityState,
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

export type ColumnMetaData = {
  cellProps?: {
    className?: string;
    onClick?: (event: MouseEvent<HTMLTableCellElement>) => void;
  };
  headProps?: {
    className?: string;
    onClick?: (event: MouseEvent<HTMLTableCellElement>) => void;
  };
};

interface RowProps<TData> {
  onClick?: (event: MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  className?: string;
}

export interface DataTableToolbarProps<TData> {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  table: TableType<TData>;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowProps?: RowProps<TData>;
  Toolbar?: FunctionComponent<DataTableToolbarProps<TData>>;
  initialVisibility?: VisibilityState;
  initialSorting?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowProps,
  Toolbar,
  initialVisibility = {},
  initialSorting = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnVisibility,
    },
  });

  return (
    <div className="space-y-4">
      {Toolbar !== undefined ? (
        <Toolbar
          globalFilter={globalFilter}
          setGlobalFilter={value => setGlobalFilter(value)}
          table={table}
        />
      ) : null}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="hover:bg-inherit">
                {headerGroup.headers.map(header => {
                  const headMeta = (
                    header.column.columnDef.meta as ColumnMetaData
                  )?.headProps;

                  return (
                    <TableHead
                      key={header.id}
                      onClick={headMeta?.onClick}
                      className={headMeta?.className}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
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
                      ? event => {
                          if (event.target instanceof HTMLButtonElement) return;
                          rowProps.onClick?.(event, row);
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map(cell => {
                    const cellMeta = (
                      cell.column.columnDef.meta as ColumnMetaData
                    )?.cellProps;

                    return (
                      <TableCell
                        key={cell.id}
                        onClick={cellMeta?.onClick}
                        className={cellMeta?.className}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
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
