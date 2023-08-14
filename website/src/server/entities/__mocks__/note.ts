import type * as Module from "@/server/entities/note";
import { createNoteMock } from "@/mocks/entities/note";

const actualModule = jest.requireActual<typeof Module>(
  "@/server/entities/note",
);
const NOTE_DURATIONS = actualModule.NOTE_DURATIONS;

const createNote = jest.fn(createNoteMock);

beforeEach(() => {
  createNote.mockClear();

  createNote.mockImplementation(createNoteMock);
});

export { NOTE_DURATIONS, createNote };
