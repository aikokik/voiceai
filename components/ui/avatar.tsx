"use client";
import { motion } from "framer-motion";

export const Avatar = () => {
  return (
    <motion.video
      src="/bubble.mov"
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      className="w-[450px] h-[450px] object-cover opacity-100 md:block"
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        WebkitFontSmoothing: 'antialiased'
      }}
    />
  );
};