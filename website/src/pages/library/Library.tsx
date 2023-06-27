import { type NextPage } from "next";
import { useRouter } from "next/router";

import { DataTable } from "@/components/ui/DataTable";
import { songColumns } from "@/pages/library/columns";
import { api } from "src/utils/api";
import { type SongInfo } from "@/server/entities/song";
import SongTableToolbar from "@/pages/library/SongTableToolbar";

const Library: NextPage = () => {
  const listSongsQuery = api.song.list.useQuery();
  const router = useRouter();

  if (!listSongsQuery.data) {
    return <div>Loading...</div>;
  }

  const handleRowClick = (song: SongInfo) => {
    void router.push(`/editor/${song.id}`);
  };

  const songs = listSongsQuery.data;

  return (
    <div className="flex h-full flex-col items-center bg-inherit p-4 pt-10 text-inherit">
      <div className="w-3/5">
        <h1 className="mb-4 text-xl">Library</h1>
      </div>
      <div className="w-3/5">
        <DataTable
          columns={songColumns}
          data={songs}
          rowProps={{
            className: "cursor-pointer",
            onClick: (_event, row) => handleRowClick(row.original),
          }}
          Toolbar={SongTableToolbar}
          initialVisibility={{ select: false }}
        />
      </div>
    </div>
  );
};

export default Library;
