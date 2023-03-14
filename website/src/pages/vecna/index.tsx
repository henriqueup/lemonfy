import { Select } from "src/components/select";
import type { NextPage } from "next";
import { useEffect } from "react";

let audio: HTMLAudioElement;
const Vecna: NextPage = () => {
  useEffect(() => {
    audio = new Audio("vecna-clock-sound.mp3");
  }, []);

  return (
    <div className="bg-black">
      <h1 className="text-gray-400">VECNA</h1>
      <div className="w-1/4 p-4">
        <Select
          label="Time"
          options={Array.from({ length: 12 }, (_, i) => ({ key: i + 1, value: (i + 1).toString() }))}
          handleChange={() => null}
          className="border border-solid border-gray-400"
        />
      </div>
      <div className="w-1/4 p-4">
        <Select
          label="Octave"
          options={Array.from({ length: 5 }, (_, i) => ({ key: i + 1, value: (i + 1).toString() }))}
          handleChange={() => null}
          className="border border-solid border-gray-400"
        />
      </div>
    </div>
  );
};

export default Vecna;
