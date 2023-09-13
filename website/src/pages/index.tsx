import fs from "fs";
import type { NextPage } from "next";
import path from "path";
import { useCallback } from "react";
import { useAudioContext } from "../hooks";
import { Button } from "@/components/ui/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import Image from "next/image";

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
    <div className="m-auto flex h-full w-4/5 flex-col items-center pl-2 pr-2">
      <div className="flex w-full flex-col items-center gap-4 p-8">
        <div className="flex w-full flex-col gap-2 py-2">
          <h1 className="py-2 text-4xl">
            Welcome to <span className="text-lemon">Lemonfy</span>
          </h1>
          <p className="indent-8">
            This is a software built to enable creation and learning of both{" "}
            <span className="text-lemon">software</span> and{" "}
            <span className="text-lemon">music</span>. Song notations for any
            user to learn how to play and a lot of software for myself to learn
            how to code!
          </p>
          <div className="m-auto flex w-4/5 flex-col">
            <Accordion
              className="w-full"
              type="multiple"
              defaultValue={["item-2"]}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lemon">
                  Quick video demo
                </AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lemon">
                  Library
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lemon">
                  Instruments
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It&apos;s animated by default, but you can disable it if
                  you prefer.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lemon">
                  About Me
                </AccordionTrigger>
                <AccordionContent>
                  <div className="m-auto flex w-3/5 flex-col items-center gap-2">
                    <Image
                      src="/profile.jpg"
                      alt="profile"
                      width="256"
                      height="256"
                      className="rounded-full"
                    />
                    <p className="indent-8">
                      This site is the product of combining two things that are
                      a huge part of my life:{" "}
                      <span className="text-lemon">software</span> and{" "}
                      <span className="text-lemon">music</span>. Ever since I
                      was a child and my father gifted me my first mp3 player, I
                      fell in love with music. My passion for software and
                      computers came a bit later, when I started playing
                      videogames. A few years into my teenage life I also
                      started learning the guitar and one particular tool caught
                      my attention, the software called{" "}
                      <a href="https://www.songsterr.com/">Songsterr</a>.
                    </p>
                    <p className="indent-8">
                      {" "}
                      Eventually, my high school graduation came around and,
                      though I considered adventuring in a carreer in music, the
                      rational side of me was stronger and I started a
                      bachelor&apos;s in computer science. Fast forward a few
                      years, I&apos;m joining the software industry and
                      beginning a career as a developer. At this point, having
                      the tools and knowledge of software development at my
                      disposal, I looked back, remembered that{" "}
                      <a href="https://www.songsterr.com/">Songsterr</a> app and
                      thought, how hard would it be to build something like it?
                      Turns out it is pretty hard! But I always liked challenges
                      and here we are!
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="flex hidden w-full justify-center gap-4">
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
