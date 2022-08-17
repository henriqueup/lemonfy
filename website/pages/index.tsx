import fs from "fs";
import type { NextPage } from "next";
import path from "path";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/button/button";
import styles from "../styles/root.module.css";

type HomeProps = {
  audioBufferJSON: Buffer;
};

const Home: NextPage<HomeProps> = ({ audioBufferJSON }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    setAudioContext(new AudioContext());

    return () => {
      audioContext?.close();
    };
  }, []);

  const playAudio = useCallback(
    async (startTime: number): Promise<void> => {
      if (!audioContext) return;

      const source = audioContext.createBufferSource();
      const audioBuffer = await audioContext.decodeAudioData(Buffer.from(audioBufferJSON).buffer);

      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(audioContext.currentTime + startTime);
    },
    [audioContext, audioBufferJSON],
  );

  return (
    <div className={styles.container}>
      <div>
        <Button text="MIAU after 1 second" variant="success" onClick={() => playAudio(1)} />
        <Button text="MIAU after 2.5 seconds" variant="success" onClick={() => playAudio(2.5)} />
      </div>
    </div>
  );
};

export const getServerSideProps = () => {
  const filePath = path.resolve("./public", "MIAAAAAAAU.mp3");
  const audioBuffer = fs.readFileSync(filePath);

  return { props: { audioBufferJSON: audioBuffer.toJSON() } };
};

export default Home;
