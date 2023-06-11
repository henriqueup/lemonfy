import { type NextPage } from "next";

import { DataTable } from "@/components/ui/DataTable";
import { songColumns } from "@/pages/library/columns";
import { api } from "src/utils/api";

const Library: NextPage = () => {
  const listSongsQuery = api.song.list.useQuery();

  if (!listSongsQuery.data) {
    return <div>Loading...</div>;
  }

  const songs = listSongsQuery.data;

  return (
    <div className="h-full bg-inherit p-4 pt-10 text-inherit">
      <h2 className="mb-4">Library</h2>
      <DataTable columns={songColumns} data={songs} />
      {/* <Table className="p-4">
        <TableHeader>
          <TableHead className="ml-4">Song</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead className="mr-4 w-1/12">Edit</TableHead>
        </TableHeader>
        <TableBody>
          {songs.map(song => (
            <TableRow
              key={song.id}
              onClick={() => handleSongClick(song.id)}
              className="cursor-pointer"
            >
              <TableCell className="ml-4">{song.name}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell className="mr-4 w-1/12">
                <Edit />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  );
};

export default Library;
