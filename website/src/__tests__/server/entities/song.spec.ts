import SongModule from "@entities/song";

describe("Create Song", () => {
  it("Creates Song with initial values", () => {
    const newSong = SongModule.createSong("Test song", "Me");

    expect(newSong.name).toBe("Test song");
    expect(newSong.artist).toBe("Me");
    expect(newSong.sheets).toHaveLength(0);
  });
});
