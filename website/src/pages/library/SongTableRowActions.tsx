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
import { type SongInfo } from "@/server/entities/song";
import AlertDialog from "@/components/AlertDialog";
import { api } from "@/utils/api";
import type { ExtendedTableType } from "@/components/ui/DataTable/DataTable";

const SongTableRowActions: FunctionComponent<{
  song: SongInfo;
  table: ExtendedTableType<SongInfo>;
}> = ({ song, table }) => {
  const deleteManySongsMutation = api.song.deleteMany.useMutation();
  const router = useRouter();

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [isLoadingDeletion, setIsLoadingDeletion] = useState(false);

  const handleEditClick = () => {
    void router.push(`/editor/${song.id}`);
  };

  const handleDeleteClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmSongDeletion = async () => {
    const songIdsToDelete = table
      .getFilteredSelectedRowModel()
      .rows.map(row => row.original.id);

    setIsLoadingDeletion(true);

    await deleteManySongsMutation.mutateAsync(songIdsToDelete);
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
        description="You are about to permanently delete the selected songs. Are you sure?"
        handleCancel={() => setIsConfirmDeleteDialogOpen(false)}
        handleContinue={() => void handleConfirmSongDeletion()}
        isLoading={isLoadingDeletion}
      />
    </>
  );
};

export default SongTableRowActions;
