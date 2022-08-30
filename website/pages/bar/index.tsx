import { NextPage } from "next";
import { Button } from "../../components/button/button";
import { generateOscillators, getMoonlightSonataBars } from "../../entities/bar";
import { useAudioContext } from "../../hooks";
import styles from "../../styles/root.module.css";

const bars = getMoonlightSonataBars();

const Bar: NextPage = () => {
  const audioContext = useAudioContext();

  const play = () => {
    generateOscillators(bars, audioContext);
  };

  return (
    <div className={styles.container}>
      <Button text="Play" variant="success" onClick={play} />
    </div>
  );
};

export default Bar;
