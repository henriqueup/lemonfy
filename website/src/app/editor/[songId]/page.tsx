import Editor from "src/app/editor/[songId]/Editor";
import { routerCaller } from "src/server/api/root";

interface Params {
  params: {
    songId: string;
  };
}

export default async function Page({ params }: Params) {
  const song = await routerCaller.song.get(params.songId);

  return <Editor song={song} />;
}

export async function generateStaticParams() {
  const songs = await routerCaller.song.list();
  console.log(songs);

  return songs.map(song => ({
    songId: song.id,
  }));
}
