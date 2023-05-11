import { type NextPage } from "next";
import Link from "next/link";
import { api } from "src/utils/api";

const Library: NextPage = () => {
  const listSongsQuery = api.song.list.useQuery();

  if (!listSongsQuery.data) {
    return <div>Loading...</div>;
  }

  const songs = listSongsQuery.data;

  return (
    <div className="p-4">
      <ul>
        {songs.map(song => (
          <li key={`${song.name}-${song.artist}`}>
            <Link href={`/editor/${song.id ?? "404"}`}>
              {`${song.name} - ${song.artist}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Library;
