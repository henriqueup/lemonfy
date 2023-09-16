import { createBarMock } from "@/mocks/entities/bar";

const convertDurationInBarToSeconds = jest.fn(
  (_, duration: number) => duration,
);
const createBar = jest.fn(createBarMock);
const cropBar = jest.fn();
const fillBarTrack = jest.fn();
const findBarNoteByTime = jest.fn();
const setBarTimesInSeconds = jest.fn();
const sumBarsCapacity = jest.fn(() => 8);

beforeEach(() => {
  convertDurationInBarToSeconds.mockReset();
  createBar.mockReset();
  cropBar.mockReset();
  fillBarTrack.mockReset();
  findBarNoteByTime.mockReset();
  setBarTimesInSeconds.mockReset();
  sumBarsCapacity.mockReset();

  convertDurationInBarToSeconds.mockImplementation(
    (_, duration: number) => duration,
  );
  createBar.mockImplementation(createBarMock);
  sumBarsCapacity.mockImplementation(() => 8);
});

export {
  convertDurationInBarToSeconds,
  createBar,
  cropBar,
  fillBarTrack,
  findBarNoteByTime,
  setBarTimesInSeconds,
  sumBarsCapacity,
};
