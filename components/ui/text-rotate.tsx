'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextRotateProps {
  texts: string[];
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TextRotate: React.FC<TextRotateProps> = ({
  texts,
  delay = 2000,
  className,
  style
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, delay);
    return () => clearInterval(timer);
  }, [texts, delay]);

  return (
    <span className="inline-flex flex-col relative overflow-hidden h-[1.12em] align-top w-[320px] sm:w-[480px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className={`block text-left ${className}`}
          initial={{ y: "80%", opacity: 0, rotateX: 45 }}
          animate={{ y: "0%", opacity: 1, rotateX: 0 }}
          exit={{ y: "-80%", opacity: 0, rotateX: -45 }}
          transition={{ type: "spring", damping: 16, stiffness: 120 }}
          style={{ ...style, transformOrigin: "50% 50% -20px" }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
