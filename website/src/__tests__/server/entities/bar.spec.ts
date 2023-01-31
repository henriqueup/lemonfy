import { createBar, SECONDS_PER_MINUTE } from "../../../server/entities/bar";

describe("Bar entity tests", () => {
  it("Creates bars with initial values", () => {
    const newBar = createBar(3, 3, 4, 3 / 4, 80);

    expect(newBar.beatCount).toBe(3);
    expect(newBar.dibobinador).toBe(4);
    expect(newBar.capacity).toBe(3 / 4);
    expect(newBar.start).toBe(3 / 4);
    expect(newBar.tempo).toBe(80);
    expect(newBar.timeRatio).toBe(80 / SECONDS_PER_MINUTE);
    expect(newBar.trackCount).toBe(3);
    expect(newBar.tracks).toHaveLength(3);

    expect(newBar.tracks[0]).toHaveLength(0);
    expect(newBar.tracks[1]).toHaveLength(0);
    expect(newBar.tracks[2]).toHaveLength(0);

    expect(newBar.index).toBeUndefined();
  });
});
