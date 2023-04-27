import type { ISongRepository } from "@domains/repository";
import type { Song } from "@entities/song";

const SongRepository: ISongRepository = {
  create: (song: Song) => {
    console.log(`Save song '${song.name} - ${song.artist}' to prisma`);
  },
};

export default SongRepository;
