import { ReactNode } from "react";
import Link from "next/link";

export function Button({
  className,
  children,
  href,
}: {
  className: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      className={[
        "bg-rose-600 uppercase font-bold px-8 py-2 tracking-very-wide hover:bg-rose-700",
        className,
      ].join(" ")}
      href={href}
    >
      {children}
    </Link>
  );
}
