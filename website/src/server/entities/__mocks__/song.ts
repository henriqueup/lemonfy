import type * as Module from "@/server/entities/song";

const actualModule = jest.requireActual<typeof Module>(
  "@/server/entities/song",
);
const SongSchema = actualModule.SongSchema;

const createSong = jest.fn();

beforeEach(() => {
  createSong.mockReset();
});

export { createSong, SongSchema };
