import { type NextPage } from "next";
import { useEffect } from "react";

import CreateInstrumentDialog from "@/pages/instruments/CreateInstrumentDialog";
import { setGlobalLoading } from "@/store/global/globalActions";
import { api } from "@/utils/api";
import { toast } from "@/hooks/useToast";
import { type InstrumentInfo } from "@/server/entities/instrument";
import { DataTable } from "@/components/ui/DataTable";
import { instrumentColumns } from "@/pages/instruments/columns";
import InstrumentTableToolbar from "@/pages/instruments/InstrumentTableToolbar";

const Instruments: NextPage = () => {
  const handleFinishedListingInstruments = () => {
    setGlobalLoading(false);
  };

  useEffect(() => {
    setGlobalLoading(true);
  }, []);

  const listInstrumentsQuery = api.instrument.list.useQuery(undefined, {
    onSuccess: handleFinishedListingInstruments,
    onError: error => {
      toast({
        variant: "destructive",
        title: "Error when fetching Instruments",
        description: error.message,
      });
      handleFinishedListingInstruments();
    },
  });

  const handleRowClick = async (instrument: InstrumentInfo) => {
    setGlobalLoading(true);
    // await router.push(`/editor/${instrument.id}`);
    setGlobalLoading(false);
  };

  const revalidateInstruments = async () => {
    await listInstrumentsQuery.refetch();
  };

  const instruments = listInstrumentsQuery.data;

  return (
    <div className="flex h-full flex-col items-center space-y-4 bg-inherit p-4 pt-10 text-inherit">
      <div className="flex w-3/5 justify-between">
        <h1 className="mb-4 text-xl">Instruments</h1>
        <CreateInstrumentDialog />
      </div>
      <div className="w-3/5">
        <DataTable
          columns={instrumentColumns(revalidateInstruments)}
          data={instruments ?? []}
          rowProps={{
            className: "cursor-pointer",
            onClick: (_event, row) => void handleRowClick(row.original),
          }}
          Toolbar={InstrumentTableToolbar}
          initialVisibility={{ select: false }}
        />
      </div>
    </div>
  );
};

export default Instruments;
