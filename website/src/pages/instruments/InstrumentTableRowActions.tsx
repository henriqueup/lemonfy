import { type MouseEvent, type FunctionComponent, useState } from "react";
import { useRouter } from "next/router";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { type InstrumentInfo } from "@/server/entities/instrument";
import AlertDialog from "@/components/AlertDialog";
import { api } from "@/utils/api";
import type { ExtendedTableType } from "@/components/ui/DataTable/DataTable";

const InstrumentTableRowActions: FunctionComponent<{
  instrument: InstrumentInfo;
  table: ExtendedTableType<InstrumentInfo>;
}> = ({ instrument, table }) => {
  // const deleteManyInstrumentsMutation = api.instrument.deleteMany.useMutation();

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [isLoadingDeletion, setIsLoadingDeletion] = useState(false);

  const handleEditClick = () => {};

  const handleDeleteClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmInstrumentDeletion = async () => {
    const instrumentIdsToDelete = table
      .getFilteredSelectedRowModel()
      .rows.map(row => row.original.id);

    setIsLoadingDeletion(true);

    // await deleteManyInstrumentsMutation.mutateAsync(instrumentIdsToDelete);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await table.revalidateData?.();

    table.setRowSelection({});
    setIsLoadingDeletion(false);
    setIsConfirmDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={handleEditClick}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            onClick={handleDeleteClick}
            className="cursor-pointer"
          >
            <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        isOpen={isConfirmDeleteDialogOpen}
        title="Attention!"
        description="You are about to permanently delete the selected instruments. Are you sure?"
        handleCancel={() => setIsConfirmDeleteDialogOpen(false)}
        handleContinue={() => void handleConfirmInstrumentDeletion()}
        isLoading={isLoadingDeletion}
      />
    </>
  );
};

export default InstrumentTableRowActions;
