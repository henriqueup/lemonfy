import { routerCaller } from "src/server/api/root";

export default async function Page() {
  const songs = await routerCaller.song.list();

  return (
    <div className="p-4">
      <ul>
        {songs.map(song => (
          <li key={`${song.name}-${song.artist}`}>
            <span>{`${song.name} - ${song.artist}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
