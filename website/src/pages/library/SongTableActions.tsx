import { type FunctionComponent } from "react";
import { useRouter } from "next/router";

import { Edit } from "lucide-react";
import { TableCell } from "@/components/ui/Table";
import { type Song } from "@/server/entities/song";

const SongTableActions: FunctionComponent<{ song: Song }> = ({ song }) => {
  const router = useRouter();

  const handleEditClick = () => {
    void router.push(`/editor/${song.id ?? "404"}`);
  };

  return (
    <TableCell onClick={handleEditClick} className="mr-4 w-1/12">
      <Edit />
    </TableCell>
  );
};

export default SongTableActions;
