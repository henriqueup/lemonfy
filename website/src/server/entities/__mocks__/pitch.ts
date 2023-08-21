import type * as Module from "@/server/entities/pitch";

const actualModule = jest.requireActual<typeof Module>(
  "@/server/entities/pitch",
);

const createPitch = jest.fn();

beforeEach(() => {
  createPitch.mockReset();
});

module.exports = {
  ...actualModule,
  createPitch,
};
