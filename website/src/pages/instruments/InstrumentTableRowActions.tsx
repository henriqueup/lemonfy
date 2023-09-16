import { type MouseEvent, type FunctionComponent, useState } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import type { Table } from "@tanstack/react-table";

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
import { toast } from "@/hooks/useToast";

type Props = {
  instrument: InstrumentInfo;
  table: Table<InstrumentInfo>;
  revalidateData: () => Promise<void>;
  onEditClick: (instrument: InstrumentInfo) => void;
};

const InstrumentTableRowActions: FunctionComponent<Props> = ({
  instrument,
  table,
  revalidateData,
  onEditClick,
}) => {
  const deleteManyInstrumentsMutation = api.instrument.deleteMany.useMutation({
    onSettled: () => {
      setIsLoadingDeletion(false);
      setIsConfirmDeleteDialogOpen(false);
    },
    onSuccess: async () => {
      table.setRowSelection({});
      await revalidateData();
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Error when deleting Instruments",
        description: error.message,
      });
    },
  });

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [isLoadingDeletion, setIsLoadingDeletion] = useState(false);

  const handleDeleteClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmInstrumentDeletion = () => {
    const instrumentIdsToDelete = table
      .getFilteredSelectedRowModel()
      .rows.map(row => row.original.id);

    setIsLoadingDeletion(true);

    deleteManyInstrumentsMutation.mutate(instrumentIdsToDelete);
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
            onClick={() => onEditClick(instrument)}
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
        handleContinue={handleConfirmInstrumentDeletion}
        isLoading={isLoadingDeletion}
      />
    </>
  );
};

export default InstrumentTableRowActions;
