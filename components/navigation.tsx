import Link from "next/link";
import { Squeeze as Hamburger } from "hamburger-react";
import { NavItem } from "@/components/navItem";
import { useIsMD } from "@/lib/mediaQuery";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  return (
    <div
      className={
        "flex justify-between items-center relative z-50 lg:px-10 px-6 lg:py-8 py-5"
      }
    >
      <Link
        href={"/"}
        className={
          "z-20 underline_animated uppercase tracking-very-wide font-bold sm:text-lg text-base"
        }
      >
        Ecstatic Dance <span className={"font-normal text-sm"}>.nl</span>
      </Link>

      <AnimatePresence>
        {(isMD || (!isMD && isOpen)) && (
          <motion.nav
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -200 }}
            className={
              "absolute md:relative z-10 md:w-auto w-full md:bg-transparent bg-blue-950 left-0 top-0 md:h-auto h-screen lg:gap-8 gap-4 tracking-wider flex md:flex-row flex-col justify-center items-center"
            }
          >
            {!isMD && <NavItem href={"/"}>Home</NavItem>}
            <NavItem href={"/over"}>Introductie</NavItem>
            <NavItem href={"/locaties"}>Locaties</NavItem>
            <NavItem href={"/agenda"}>Agenda</NavItem>
          </motion.nav>
        )}
      </AnimatePresence>
      {!isMD && (
        <div className={"z-20 relative"}>
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
      )}
    </div>
  );
}
