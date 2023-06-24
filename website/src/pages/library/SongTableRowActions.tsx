import { type MouseEvent, type FunctionComponent, useState } from "react";
import { useRouter } from "next/router";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { type SongInfo } from "@/server/entities/song";
import AlertDialog from "@/components/AlertDialog";

const SongTableRowActions: FunctionComponent<{
  song: SongInfo;
  table: Table<SongInfo>;
}> = ({ song, table }) => {
  const router = useRouter();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

  const handleEditClick = () => {
    void router.push(`/editor/${song.id ?? "404"}`);
  };

  const handleDeleteClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    console.log(
      table.getFilteredSelectedRowModel().rows.map(row => row.original.id),
    );
    setIsConfirmDeleteDialogOpen(true);
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
        handleContinue={() => console.log("deleting songs")}
      />
    </>
  );
};

export default SongTableRowActions;
