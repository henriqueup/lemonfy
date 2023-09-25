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
    <div className="m-auto flex h-full w-full flex-col items-center pl-2 pr-2 lg:w-4/5">
      <div className="flex w-full flex-col items-center gap-4 p-8">
        <div className="flex w-full flex-col gap-2 py-2">
          <h1 className="py-2 text-3xl lg:text-4xl">
            Welcome to <span className="text-lemon">Lemonfy</span>
          </h1>
          <div className="text-sm lg:text-lg">
            <p className="indent-4 lg:indent-8">
              This is a software built to provide creation and learning of both{" "}
              <span className="text-lemon">music</span> and{" "}
              <span className="text-lemon">software</span>.
            </p>
            <p className="indent-4 lg:indent-8">
              Song notations for any user to learn how to play and a lot of
              software for myself to learn how to code!
            </p>
          </div>
          <div className="flex w-full flex-col lg:w-4/5 lg:pl-8">
            <Accordion
              className="w-full"
              type="multiple"
              defaultValue={["item-1"]}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lemon">
                  Quick video demo
                </AccordionTrigger>
                <AccordionContent>
                  <div className="h-[210px] w-full lg:h-[630px] lg:w-[1120px]">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/JZ5fAAQY2ek?si=EQC0YVdyu9uuc5X3"
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
                  <div className="flex w-full flex-col gap-2 px-1 lg:w-3/5 lg:px-4">
                    <p>
                      This is the main page where Songs are listed and it&apos;s
                      possible to update or delete them, as well as create new
                      ones. Song creation, edition and reproduction can be done
                      within the Editor, which can be accessed by clicking on
                      the &apos;New Song&apos; button or on a listed Song to
                      edit and play it.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lemon">
                  Instruments
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex w-full flex-col gap-2 px-1 lg:w-3/5 lg:px-4">
                    <p>
                      This page should be used to manage available Instruments
                      that are used when creating Songs. It contains a list of
                      existing Instruments and enables basic operations on them
                      (create, update, delete).
                    </p>
                    <div className="flex flex-col gap-1">
                      <p>
                        An Instrument is composed of 4 main properties:
                        &apos;Type&apos;, &apos;Track Count&apos;, &apos;Is
                        Fretted&apos; and &apos;Tuning&apos;.
                      </p>
                      <ul className="flex list-decimal flex-col gap-1 px-4 marker:text-lemon lg:px-8">
                        <li>
                          <p className="text-lemon">Type:</p>
                          <div className="flex flex-col gap-2 px-1 lg:px-4">
                            <p>
                              The type of an Instrument dictates some of
                              it&apos;s basic properties, such as how many
                              tracks it can have and how it should be tuned.
                            </p>
                            <p>
                              There are 4 types of Instruments planned to be
                              available: &apos;String&apos;, &apos;Key&apos;,
                              &apos;Wind&apos; and &apos;Percussion&apos;, but
                              currently only &apos;String&apos; Instruments are
                              supported.
                            </p>
                          </div>
                        </li>
                        <li>
                          <p className="text-lemon">Track Count:</p>
                          <div className="flex flex-col gap-2 px-1 lg:px-4">
                            <p>
                              This is a number that indicates how many
                              &apos;channels&apos; of audio the Instrument can
                              produce at once. This could be for example the
                              amount of strings, keys, pipes etc the Instrument
                              has.
                            </p>
                          </div>
                        </li>
                        <li>
                          <p className="text-lemon">Is Fretted:</p>
                          <div className="flex flex-col gap-2 px-1 lg:px-4">
                            <p>
                              This is a true or false flag that indicates
                              whether of not the Instrument differentiates
                              it&apos;s pitches discretely or continuously.
                              Think frets, keys or pipe holes - discrete;
                              fretless and slides - continuous.
                            </p>
                            <p>
                              This will also indicate if within an
                              Instrument&apos;s track, a pitch can be mapped
                              from a number. As such, the notation and
                              composition processes in the editor can be
                              simplified.
                            </p>
                          </div>
                        </li>
                        <li>
                          <p className="text-lemon">Tuning:</p>
                          <div className="flex flex-col gap-2 px-1 lg:px-4">
                            <p>
                              The Instrument&apos;s tuning is represented as a
                              list of base pitches which are produced when one
                              of it&apos;s tracks is played without any other
                              interaction.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lemon">
                  Editor
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex w-full flex-col gap-2 px-1 lg:w-3/5 lg:px-4">
                    <p>
                      This is page where the magic happens. It will be used to
                      create, edit and playback Songs. The complete procces of
                      Song creation should take the following steps:
                    </p>
                    <ul className="flex list-decimal flex-col gap-1 px-4 marker:text-lemon lg:px-8">
                      <li>
                        <p className="text-lemon">Create Song:</p>
                        <div className="flex flex-col gap-2 px-1 lg:px-4">
                          <p>
                            Here the basic Song information -name and artist-
                            should be provided.
                          </p>
                        </div>
                      </li>
                      <li>
                        <p className="text-lemon">Add Instrument:</p>
                        <div className="flex flex-col gap-2 px-1 lg:px-4">
                          <p>
                            You can&apos;t have a Song without Instruments. To
                            add one, it should be selected from the list of
                            Instruments that already exist. It is also possible
                            to create a new one directly or go to the
                            Instruments to further manage them.
                          </p>
                        </div>
                      </li>
                      <li>
                        <p className="text-lemon">Add Bars:</p>
                        <div className="flex flex-col gap-2 px-1 lg:px-4">
                          <p>
                            From here the actual structure of the Song can begin
                            to take shape. The basic measure of a Song&apos;s
                            notation is referred to as a &apos;Bar&apos;. It
                            will define a time signature and the tempo for the
                            Notes within it.
                          </p>
                          <p>
                            The time signature indicates the size of the Bar by
                            defining two numbers. These can be referred to in
                            many ways, here they&apos;ll be called &apos;Beat
                            Count&apos; and &apos;Dibobinador&apos;. The former
                            defines how many beats there are inside the Bar and
                            the latter how long those beats are.
                          </p>
                          <p>
                            Finally, the tempo is a ratio to actual time,
                            measured in beats per minute. Consider a simple
                            example of a Bar with a 4/4 time signature and tempo
                            of 60. This Bar will have 4 beats with a duration of
                            a quarter each and they should each last for 1
                            second. This means if we add a quarter note to it,
                            it will also last 1 second.
                          </p>
                        </div>
                      </li>
                      <li>
                        <p className="text-lemon">Add Notes:</p>
                        <div className="flex flex-col gap-2 px-1 lg:px-4">
                          <p>
                            At last, Notes can be added to the Bars so that some
                            sound can be made! These will define 3 basic values:
                            &apos;Pitch Name&apos;, &apos;Octave&apos; and
                            &apos;Duration&apos;.
                          </p>
                          <p>
                            The Pitch Name and Octave values combined will
                            define the actual pitch value of the sound wave. And
                            the Duration is represented as a fraction related to
                            the time signature of the Bar which contains the
                            Note.
                          </p>
                          <p>
                            When working with Instruments that have frets, Notes
                            can be added in a simpler, numeric way. Simply
                            pressing the number of the desired Note&apos;s fret
                            and the Pitch Name and Octave are already
                            calculated. To use multiple digit fret numbers, keep
                            the ⇧Shift key pressed.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lemon">
                  About Me
                </AccordionTrigger>
                <AccordionContent>
                  <div className="m-auto flex w-full flex-col items-center gap-2 lg:w-3/5">
                    <Image
                      src="/profile.jpg"
                      alt="profile"
                      width="256"
                      height="256"
                      className="rounded-[100%]"
                    />
                    <p className="indent-4 lg:indent-8">
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
                    <p className="indent-4 lg:indent-8">
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
