import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { routerCaller } from "src/server/api/root";
import Editor, { type EditorProps } from "../Editor";
import { useRouter } from "next/router";
import { setGlobalLoading } from "@/store/global/globalActions";

type StaticPropsParams = {
  songId?: string;
};

export const getStaticPaths = async (): Promise<
  GetStaticPathsResult<StaticPropsParams>
> => {
  const songs = await routerCaller.song.list();

  return {
    paths: songs.map(song => ({ params: { songId: song.id } })),
    fallback: true, // can also be true or 'blocking'
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<StaticPropsParams>,
): Promise<GetStaticPropsResult<EditorProps>> => {
  const songId = context.params?.songId;
  if (songId === undefined) return { props: {} };

  const song = await routerCaller.song.get(songId);

  return {
    props: { songToLoad: song },
    revalidate: 10,
  };
};

const EditorSSG: NextPage<EditorProps> = ({ songToLoad }) => {
  const router = useRouter();

  if (router.isFallback) {
    setGlobalLoading(true);
    return null;
  }

  return <Editor songToLoad={songToLoad} />;
};

export default EditorSSG;
