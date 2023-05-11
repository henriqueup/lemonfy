import { routerCaller } from "src/server/api/root";
import Editor, { type EditorProps } from "./Editor";
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  NextPage,
} from "next";

type StaticPropsParams = {
  songId?: string;
};

export const getStaticPaths = async (): Promise<
  GetStaticPathsResult<StaticPropsParams>
> => {
  const songs = await routerCaller.song.list();

  return {
    paths: songs.map(song => ({ params: { songId: song.id } })),
    fallback: false, // can also be true or 'blocking'
  };
};

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps = async (
  context: GetStaticPropsContext<StaticPropsParams>,
): Promise<GetStaticPropsResult<EditorProps>> => {
  const songId = context.params?.songId;
  if (songId === undefined) return { props: {} };

  const song = await routerCaller.song.get(songId);

  return {
    // Passed to the page component as props
    props: { song },
  };
};

const EditorSSG: NextPage<EditorProps> = ({ song }) => {
  return <Editor song={song} />;
};

export default EditorSSG;
