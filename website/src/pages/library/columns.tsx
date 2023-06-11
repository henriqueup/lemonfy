import { type ColumnDef } from "@tanstack/react-table";

import { type Song } from "@/server/entities/song";
import SongTableActions from "@/pages/library/SongTableActions";

export const songColumns: ColumnDef<Song>[] = [
  {
    accessorKey: "name",
    header: () => <div className="ml-4">Song</div>,
    cell: ({ row }) => <div className="ml-4">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "artist",
    header: "Artist",
  },
  {
    id: "actions",
    header: () => <div className="mr-4 w-1/12" />,
    cell: ({ row }) => <SongTableActions song={row.original} />,
    meta: { skipContentWrap: true },
  },
];
