import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { NumberField, TextField } from "src/components";

let audio: HTMLAudioElement;
const Vecna: NextPage = () => {
  useEffect(() => {
    audio = new Audio("vecna-clock-sound.mp3");
  }, []);

  const [textValue, setTextValue] = useState<string | undefined>();
  const [numberValue, setNumberValue] = useState<number | undefined>();

  return (
    <div className="h-full bg-black">
      <h1 className="text-stone-600 dark:text-stone-400">VECNA</h1>
      <div className="w-1/4 p-4">
        <TextField
          label="Test Text Field"
          value={textValue}
          onChange={(newValue?: string) => {
            setTextValue(newValue);
          }}
        />
      </div>
      <div className="w-1/4 p-4">
        <NumberField
          label="Test Number Field"
          value={numberValue}
          onChange={(newValue?: number) => {
            setNumberValue(newValue);
          }}
        />
      </div>
    </div>
  );
};

export default Vecna;
