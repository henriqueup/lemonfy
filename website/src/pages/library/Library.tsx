import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/ui/DataTable";
import { songColumns } from "@/pages/library/columns";
import { api } from "src/utils/api";
import { type SongInfo } from "@/server/entities/song";
import SongTableToolbar from "@/pages/library/SongTableToolbar";
import { toast } from "@/hooks/useToast";
import { setGlobalLoading } from "@/store/global/globalActions";
import { Button } from "@/components/ui/Button";

const Library: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    setGlobalLoading(true);
  }, []);

  const listSongsQuery = api.song.list.useQuery(undefined, {
    onSettled: () => setGlobalLoading(false),
    onError: error => {
      toast({
        variant: "destructive",
        title: "Error when fetching Songs",
        description: error.message,
      });
    },
  });

  const handleRowClick = async (song: SongInfo) => {
    setGlobalLoading(true);
    await router.push(`/editor/${song.id}`);
    setGlobalLoading(false);
  };

  const revalidateSongs = async () => {
    await listSongsQuery.refetch();
  };

  const songs = listSongsQuery.data;

  return (
    <div className="flex h-full flex-col items-center gap-2 p-4 pt-10 text-inherit">
      <div className="flex w-full justify-between lg:w-3/5">
        <h1 className="mb-4 text-xl">Library</h1>
        <Button
          className="flex justify-center"
          variant="success"
          onClick={() => void router.push("/editor")}
        >
          New Song
          <Plus className="ml-1" />
        </Button>
      </div>
      <div className="w-full lg:w-3/5">
        <DataTable
          columns={songColumns(revalidateSongs)}
          data={songs ?? []}
          rowProps={{
            className: "cursor-pointer",
            onClick: (_event, row) => void handleRowClick(row.original),
          }}
          Toolbar={SongTableToolbar}
          initialVisibility={{ select: false }}
        />
      </div>
    </div>
  );
};

export default Library;
