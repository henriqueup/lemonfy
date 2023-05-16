import { type NextPage } from "next";
import Link from "next/link";

import { Fieldset } from "src/components/fieldset";
import LibraryMenu from "src/pages/library/LibraryMenu";
import { api } from "src/utils/api";

const Library: NextPage = () => {
  const listSongsQuery = api.song.list.useQuery();

  if (!listSongsQuery.data) {
    return <div>Loading...</div>;
  }

  const songs = listSongsQuery.data;

  return (
    <div className="h-full bg-inherit p-4 pt-10 text-inherit">
      <Fieldset label="Library" shrinkLabel className="h-full">
        <ul className="m-4">
          {songs.map(song => (
            <li key={`${song.name}-${song.artist}`}>
              <Link href={`/editor/${song.id ?? "404"}`}>
                {`${song.name} - ${song.artist}`}
              </Link>
            </li>
          ))}
        </ul>
      </Fieldset>
      <LibraryMenu />
    </div>
  );
};

export default Library;
