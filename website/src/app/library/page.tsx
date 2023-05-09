import Link from "next/link";
import { routerCaller } from "src/server/api/root";

export default async function Page() {
  const songs = await routerCaller.song.list();

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
}
