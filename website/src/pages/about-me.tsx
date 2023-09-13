import type { NextPage } from "next";

const AboutMe: NextPage = () => {
  return (
    <div className="m-auto flex h-full w-4/5 flex-col items-center pl-2 pr-2">
      <div className="flex w-full flex-col items-center gap-4 p-8">
        <div className="flex w-full flex-col gap-2">
          <h1 className="py-2 text-4xl">
            About <span className="text-lemon">Me</span>
          </h1>
          <p className="indent-8">
            This site is the product of combining two things that are a huge
            part of my life: <span className="text-lemon">software</span> and{" "}
            <span className="text-lemon">music</span>. Ever since I was a child
            and my father gifted me my first mp3 player, I fell in love with
            music. My passion for software and computers came a bit later, when
            I started playing videogames. A few years into my teenage life I
            also started learning the guitar and one particular tool caught my
            attention, the software called{" "}
            <a href="https://www.songsterr.com/">Songsterr</a>.
          </p>
          <p className="indent-8">
            {" "}
            Eventually, my high school graduation came around and, though I
            considered adventuring in a carreer in music, the rational side of
            me was stronger and I started a bachelor&apos;s in computer science.
            Fast forward a few years, I&apos;m joining the software industry and
            beginning a career as a developer. At this point, having the tools
            and knowledge of software development at my disposal, I looked back,
            remembered that <a href="https://www.songsterr.com/">
              Songsterr
            </a>{" "}
            app and thought, how hard would it be to build something like it?
            Turns out it is pretty hard! But I always liked challenges and here
            we are!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
