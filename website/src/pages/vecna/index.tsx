import type { NextPage } from "next";
import { useEffect } from "react";
import { Pause, Play, Rewind, RewindFull, Stop, Wind, WindFull } from "src/icons";

let audio: HTMLAudioElement;
const Vecna: NextPage = () => {
  useEffect(() => {
    audio = new Audio("vecna-clock-sound.mp3");
  }, []);

  return (
    <div className="bg-black">
      <h1 className="text-stone-600 dark:text-stone-400">VECNA</h1>
      <div className="w-1/4 p-4">
        <Play stroke="lightgray" />
      </div>
      <div className="w-1/4 p-4">
        <Stop stroke="lightgray" />
      </div>
      <div className="w-1/4 p-4">
        <Pause stroke="lightgray" />
      </div>
      <div className="w-1/4 p-4">
        <Rewind stroke="lightgray" />
      </div>
      <div className="w-1/4 p-4">
        <RewindFull stroke="lightgray" />
      </div>
      <div className="w-1/4 p-4">
        <Wind stroke="lightgray" />
      </div>
      <div className="w-1/4 p-4">
        <WindFull stroke="lightgray" />
      </div>
    </div>
  );
};

export default Vecna;
