import type * as Module from "@/server/entities/instrument";

const actualModule = jest.requireActual<typeof Module>(
  "@/server/entities/instrument",
);
const InstrumentSchema = actualModule.InstrumentSchema;

const addNoteToInstrument = jest.fn();
const addNoteToFrettedInstrument = jest.fn();

beforeEach(() => {
  addNoteToInstrument.mockReset();
  addNoteToFrettedInstrument.mockReset();
});

export { addNoteToInstrument, addNoteToFrettedInstrument, InstrumentSchema };
