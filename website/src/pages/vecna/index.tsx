import { Select } from "@components/select";
import type { NextPage } from "next";
import { useEffect } from "react";

let audio: HTMLAudioElement;
const Vecna: NextPage = () => {
  useEffect(() => {
    audio = new Audio("vecna-clock-sound.mp3");
  }, []);

  return (
    <div>
      <h1>VECNA</h1>
      <div className="m-4 w-1/4">
        <Select
          label="Time"
          options={Array.from({ length: 12 }, (_, i) => ({ key: i + 1, value: (i + 1).toString() }))}
          handleChange={() => null}
          className="border border-solid border-black"
        />
      </div>
    </div>
  );
};

export default Vecna;
