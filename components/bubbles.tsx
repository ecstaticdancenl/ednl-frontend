import { motion } from "framer-motion";
import { useIsMD } from "@/lib/mediaQuery";
import { useEffect, useState } from "react";

const bubbleColors = [
  "bg-red-600",
  "bg-amber-500",
  "bg-pink-600",
  "bg-yellow-500",
  "bg-rose-600",
];
const bubbleDuration = [2.5, 3.5, 4.5, 3.5, 3];
const bubbleVariants = {
  initial: {},
  hover: {},
  // initial: { scale: 1 },
  // animate: { scale: [1, 1.1, 1] },
  // hover: { scale: 1.4, transition: { duration: 0.5 } },
};
const bubbleVariantsBack = {
  initial: { opacity: 1, scale: 1 },
  animate: {
    opacity: 1,
    scale: [1.1, 1, 1.1],
  },
};
const bubbleVariantsFront = {
  initial: { opacity: 0, scale: 1 },
  hover: {
    opacity: 0.5,
    scale: 1.1,
  },
};

export function Bubbles({ flipped = false, className = "" }) {
  const size = 170;
  const isMD = useIsMD();
  const [length, setLength] = useState(5);
  useEffect(() => {
    if (isMD) {
      setLength(5);
    } else {
      setLength(3);
    }
  }, [isMD]);
  return (
    <section
      className={[
        "grid top-0 w-full absolute z-0 overflow-x-clip",
        isMD ? "grid-cols-5 h-[33vw]" : "grid-cols-3 h-[50vw]",
        flipped ? "-scale-100" : "",
        className,
      ].join(" ")}
    >
      {[...Array(length)].map((_, index) => {
        return (
          <motion.div
            key={index}
            initial={"initial"}
            animate={"animate"}
            whileHover={"hover"}
            variants={bubbleVariants}
            className={`relative aspect-square ${
              index % 2 === 0 ? "self-start" : "self-end"
            }`}
            // style={{ filter: "blur(6vw)" }}
          >
            <motion.div
              variants={bubbleVariantsBack}
              style={{
                height: size + "%",
                width: size + "%",
                top: -(size - 100) / 2 + "%",
                left: -(size - 100) / 2 + "%",
                filter: "blur(6vw)",
              }}
              transition={{
                duration: bubbleDuration[index],
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`pointer-events-none z-10 absolute rounded-full ${bubbleColors[index]} `}
            ></motion.div>
            <motion.div
              variants={bubbleVariantsFront}
              style={{
                height: size + "%",
                width: size + "%",
                top: -(size - 100) / 2 + "%",
                left: -(size - 100) / 2 + "%",
                filter: "blur(6vw)",
              }}
              transition={{ duration: 0.6, repeat: 0, ease: "easeInOut" }}
              className={`pointer-events-none z-20 absolute rounded-full ${bubbleColors[index]} `}
            ></motion.div>
          </motion.div>
        );
      })}
    </section>
  );
}
