import type { NextPage } from "next";
import { useEffect } from "react";

const Vecna: NextPage = () => {
  useEffect(() => {
    const audio = new Audio("vecna-clock-sound.mp3");
    audio.play();
    return () => {
      console.log("closing vecna");
    };
  }, []);

  return <div>VECNA</div>;
};

export default Vecna;
