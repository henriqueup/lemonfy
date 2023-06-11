import { type FunctionComponent } from "react";
import { useRouter } from "next/router";
import { Edit, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { type SongInfo } from "@/server/entities/song";

const SongTableActions: FunctionComponent<{ song: SongInfo }> = ({ song }) => {
  const router = useRouter();

  const handleEditClick = () => {
    void router.push(`/editor/${song.id ?? "404"}`);
  };

  return (
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
        <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer">
          <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SongTableActions;
