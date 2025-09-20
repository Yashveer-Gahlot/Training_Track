"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

const Spotlight = ({ className, fill }: SpotlightProps) => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        setPosition({ x: e.clientX, y: e.clientY });
        setOpacity(1);
      }
    };
    const handleMouseLeave = () => setOpacity(0);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", () => setOpacity(1));

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", () => setOpacity(1));
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-0 transition-opacity duration-300",
        className
      )}
      style={{
        opacity,
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${
          fill || "hsl(var(--primary) / 0.1)"
        }, transparent 80%)`,
      }}
    />
  );
};

export default Spotlight;

