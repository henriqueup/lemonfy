import { NextPage } from "next";
import { Button } from "../../components/button/button";
import Bar, { getMasterOfPuppetsBars, getMoonlightSonataBars, playSong } from "../../entities/bar";
import { useAudioContext } from "../../hooks";
import styles from "../../styles/root.module.css";

const moonlightSonataBars = getMoonlightSonataBars();
const masterOfPuppetsBars = getMasterOfPuppetsBars();

const BarPage: NextPage = () => {
  const audioContext = useAudioContext();

  const play = (bars: Bar[]) => {
    playSong(bars, audioContext);
  };

  return (
    <div className={styles.container}>
      <Button text="Play Moonlight Sonata" variant="success" onClick={() => play(moonlightSonataBars)} />
      <Button text="Play Master of Puppets" variant="success" onClick={() => play(masterOfPuppetsBars)} />
    </div>
  );
};

export default BarPage;
