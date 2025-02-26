import Link from "next/link";
import { Squeeze as Hamburger } from "hamburger-react";
import { NavItem } from "@/components/navItem";
import { useIsMD } from "@/lib/mediaQuery";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
export function Navigation() {
  const isMD = useIsMD();
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    if (isMD) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isMD]);

  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 40) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <div
      id={"navigation"}
      className={[
        "w-full fixed top-0 left-0 z-50",
        scrolled ? "backdrop-blur-md bg-slate-900/20" : "backdrop-blur-none",
      ].join(" ")}
    >
      <div
        className={[
          "max-w-(--breakpoint-2xl) mx-auto transition-height duration-500 flex justify-between items-center z-50 lg:px-10 sm:px-6 px-4",
          scrolled ? "h-12 py-2" : "md:h-24 h-16 mb-0",
        ].join(" ")}
      >
        <Link
          href={"/"}
          className={[
            "z-20 underline_animated uppercase sm:tracking-very-wide tracking-widest font-bold transition-all duration-500",
            scrolled ? "text-sm" : "sm:text-lg text-base",
          ].join(" ")}
        >
          Ecstatic Dance{" "}
          <span className={"font-normal sm:text-sm text-xs"}>.nl</span>
        </Link>

        <AnimatePresence>
          {(isMD || (!isMD && isOpen)) && (
            <motion.nav
              key={"nav"}
              initial={!isMD ? { opacity: 0, y: -200 } : {}}
              animate={!isMD ? { opacity: 1, y: 0 } : {}}
              exit={!isMD ? { opacity: 0, y: -200 } : {}}
              className={
                "absolute md:relative z-10 md:w-auto w-full md:bg-transparent bg-blue-950 left-0 top-0 md:h-auto h-screen lg:gap-8 md:gap-3 gap-5 tracking-wider flex md:flex-row flex-col justify-center items-center text-center"
              }
            >
              {!isMD && <NavItem href={"/"}>Home</NavItem>}
              <NavItem href={"/over"}>Introductie</NavItem>
              <NavItem href={"/locaties"}>Locaties</NavItem>
              <NavItem href={"/agenda"}>Agenda</NavItem>
              <NavItem href={"/festivals-retraites"}>
                Festivals &amp; Retraites
              </NavItem>
            </motion.nav>
          )}
        </AnimatePresence>
        {!isMD && (
          <div className={"z-20 relative"}>
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
        )}
      </div>
    </div>
  );
}
