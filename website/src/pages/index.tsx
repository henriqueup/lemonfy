import fs from "fs";
import type { NextPage } from "next";
import path from "path";
import { useCallback } from "react";
import { useAudioContext } from "../hooks";
import { Button } from "@/components/ui/Button";

type HomeProps = {
  miauBuffer: Buffer;
  vecnaBuffer: Buffer;
};

const Home: NextPage<HomeProps> = ({ miauBuffer, vecnaBuffer }) => {
  const audioContext = useAudioContext();

  const playAudio = useCallback(
    async (buffer: Buffer): Promise<void> => {
      if (!audioContext) return;

      const source = audioContext.createBufferSource();
      const audioBuffer = await audioContext.decodeAudioData(
        Buffer.from(buffer).buffer,
      );

      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(audioContext.currentTime);
    },
    [audioContext],
  );

  return (
    <div className="flex h-full flex-col items-center justify-center pl-2 pr-2">
      <div className="flex flex-col gap-4">
        <div className="h-[630px] w-[1120px]">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/vlaL057ReFc?si=x3n59sld4swLuWGk"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="flex w-full justify-center gap-4">
          <Button variant="outline" onClick={() => void playAudio(miauBuffer)}>
            MIAU
          </Button>
          <Button variant="outline" onClick={() => void playAudio(vecnaBuffer)}>
            CLOCK
          </Button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = () => {
  const miauPath = path.resolve("./public", "MIAAAAAAAU.mp3");
  const vecnaPath = path.resolve("./public", "vecna-clock-sound.mp3");
  const miauBuffer = fs.readFileSync(miauPath);
  const vecnaBuffer = fs.readFileSync(vecnaPath);

  return {
    props: {
      miauBuffer: miauBuffer.toJSON(),
      vecnaBuffer: vecnaBuffer.toJSON(),
    },
  };
};

export default Home;
