import { createBar, SECONDS_PER_MINUTE, sumBarsCapacity } from "@entities/bar";

describe("Create Bar", () => {
  it("Creates Bar with initial values", () => {
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

describe("Sum Bar capacity", () => {
  it("Sums empty Bar array capacity to 0", () => {
    const totalCapacity = sumBarsCapacity([]);

    expect(totalCapacity).toBe(0);
  });

  it("Sums Bar array capacity", () => {
    const bars = [
      createBar(3, 4, 4, 0, 60, 0), // capacity = 1
      createBar(3, 3, 4, 1, 60, 1), // capacity = 3 / 4
      createBar(3, 5, 4, 2, 60, 2), // capacity = 5 / 4
      createBar(3, 6, 8, 3, 60, 3), // capacity = 6 / 8
    ];

    const totalCapacity = sumBarsCapacity(bars);

    expect(totalCapacity).toBe(1 + 3 / 4 + 5 / 4 + 6 / 8);
  });
});
