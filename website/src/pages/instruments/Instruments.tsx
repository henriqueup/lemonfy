import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import CreateInstrumentDialog from "@/pages/instruments/CreateInstrumentDialog";
import { setGlobalLoading } from "@/store/global/globalActions";
import { api } from "@/utils/api";
import { toast } from "@/hooks/useToast";
import { type InstrumentInfo } from "@/server/entities/instrument";
import { DataTable } from "@/components/ui/DataTable";
import { instrumentColumns } from "@/pages/instruments/columns";
import InstrumentTableToolbar from "@/pages/instruments/InstrumentTableToolbar";
import { Button } from "@/components/ui/Button";

const Instruments: NextPage = () => {
  const [isInstrumentDialogOpen, setIsInstrumentDialogOpen] = useState(false);
  const [instrumentToEdit, setInstrumentToEdit] = useState<
    InstrumentInfo | undefined
  >(undefined);

  useEffect(() => {
    setGlobalLoading(true);
  }, []);

  const listInstrumentsQuery = api.instrument.list.useQuery(undefined, {
    onSettled: () => setGlobalLoading(false),
    onError: error => {
      toast({
        variant: "destructive",
        title: "Error when fetching Instruments",
        description: error.message,
      });
    },
  });

  const handleRowClick = (instrument: InstrumentInfo) => {
    setIsInstrumentDialogOpen(true);
    setInstrumentToEdit(instrument);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setInstrumentToEdit(undefined);

    setIsInstrumentDialogOpen(open);
  };

  const revalidateInstruments = async () => {
    await listInstrumentsQuery.refetch();
  };

  const instruments = listInstrumentsQuery.data;

  return (
    <div className="flex h-full flex-col items-center space-y-4 p-4 pt-10 text-inherit">
      <div className="flex w-full justify-between lg:w-3/5">
        <h1 className="mb-4 text-xl">Instruments</h1>
        <Button
          variant="success"
          onClick={() => setIsInstrumentDialogOpen(true)}
        >
          Create Instrument
          <Plus className="ml-1" />
        </Button>
      </div>
      <div className="w-full lg:w-3/5">
        <DataTable
          columns={instrumentColumns(revalidateInstruments, handleRowClick)}
          data={instruments ?? []}
          tableProps={{
            className: "max-h-[70vh] overflow-auto",
          }}
          rowProps={{
            className: "cursor-pointer",
            onClick: (_event, row) => void handleRowClick(row.original),
          }}
          Toolbar={InstrumentTableToolbar}
          initialVisibility={{ select: false }}
          initialSorting={[{ id: "name", desc: false }]}
        />
      </div>
      <CreateInstrumentDialog
        isOpen={isInstrumentDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSaveSuccess={revalidateInstruments}
        dataToLoad={instrumentToEdit}
      />
    </div>
  );
};

export default Instruments;
