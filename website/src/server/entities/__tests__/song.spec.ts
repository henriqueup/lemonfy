import { createSong } from "@entities/song";

describe("Create Song", () => {
  it("Creates Song with initial values", () => {
    const newSong = createSong("Test song", "Me");

    expect(newSong.name).toBe("Test song");
    expect(newSong.artist).toBe("Me");
    expect(newSong.instruments).toHaveLength(0);
  });
});
