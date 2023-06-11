import { type SortDirection, type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface Props<TData> {
  column: Column<TData>;
  title: string;
}

export function DataTableColumnHeader<TData>({ column, title }: Props<TData>) {
  const isSorted = column.getIsSorted();

  const handleClick = () => {
    if (isSorted === "desc") {
      column.toggleSorting(undefined);
      return;
    }

    column.toggleSorting(isSorted === "asc", column.getCanMultiSort());
  };

  return (
    <Button variant="ghost" onClick={handleClick} className="-ml-4">
      {title}
      <SortIcon isSorted={isSorted} />
    </Button>
  );
}

function SortIcon({ isSorted }: { isSorted: false | SortDirection }) {
  const iconClassName = "ml-2 h-4 w-4";
  if (!isSorted) return <ArrowUpDown className={iconClassName} />;

  return isSorted === "asc" ? (
    <ArrowUp className={iconClassName} />
  ) : (
    <ArrowDown className={iconClassName} />
  );
}
