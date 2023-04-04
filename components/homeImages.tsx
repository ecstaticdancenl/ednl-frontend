import { motion } from "framer-motion";

const image = {
  hidden: { scale: 1.2, opacity: 0 },
  show: {
    scale: 1.06,
    opacity: 1,
    transition: { type: "spring", duration: 0.4, bounce: 0.5 },
  },
};
const figure = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

export function HomeImages() {
  return (
    <motion.div
      className={"md:my-16 my-12 lg:px-12 px-6 grid grid-cols-3 sm:gap-4 gap-2"}
      initial={"hidden"}
      whileInView={"show"}
      variants={figure}
    >
      <figure
        className={"translate-y-3.5 -skew-y-6 overflow-clip rounded-2xl group"}
      >
        <motion.img
          variants={image}
          className={"skew-y-6 aspect-[0.8] object-cover"}
          src="1.jpeg"
          alt="Ecstatic Dancers"
        />
      </figure>
      <figure className={"skew-y-1 overflow-clip rounded-2xl group"}>
        <motion.img
          variants={image}
          className={"-skew-y-1 aspect-[0.8] object-cover"}
          src="3.jpeg"
          alt="Ecstatic Dancers"
        />
      </figure>
      <figure
        className={"-translate-y-1 -skew-y-3 overflow-clip rounded-2xl group"}
      >
        <motion.img
          variants={image}
          className={"skew-y-3 aspect-[0.8] object-cover"}
          src="4.jpeg"
          alt="Ecstatic Dancers"
        />
      </figure>
    </motion.div>
  );
}
