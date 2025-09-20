"use client";

import { TypeAnimation } from "react-type-animation";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          The Proving Ground
        </h1>
        <TypeAnimation
          sequence={[
            "Level Up Your Skills.",
            2000,
            "Solve. Compete. Repeat.",
            2000,
            "Unlock Your Potential.",
            2000,
            "Practice Makes Perfect.",
            2000,
          ]}
          wrapper="p"
          speed={50}
          className="text-lg md:text-2xl text-muted-foreground"
          repeat={Infinity}
        />
      </div>
      <div className="absolute bottom-10 animate-bounce">
        <ChevronDown className="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
  );
};

export default Hero;

