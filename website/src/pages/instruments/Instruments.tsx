import { type NextPage } from "next";

import CreateInstrumentDialog from "@/pages/instruments/CreateInstrumentDialog";

const Instruments: NextPage = () => {
  return (
    <div className="flex h-full flex-col items-center bg-inherit p-4 pt-10 text-inherit">
      <div className="flex w-3/5 justify-between">
        <h1 className="mb-4 text-xl">Instruments</h1>
        <CreateInstrumentDialog />
      </div>
      <div className="w-3/5">
        {/* <DataTable
          columns={songColumns(revalidateSongs)}
          data={songs ?? []}
          rowProps={{
            className: "cursor-pointer",
            onClick: (_event, row) => void handleRowClick(row.original),
          }}
          Toolbar={SongTableToolbar}
          initialVisibility={{ select: false }}
        /> */}
      </div>
    </div>
  );
};

export default Instruments;
