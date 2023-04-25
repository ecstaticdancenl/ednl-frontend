import { ReactNode } from "react";
import Link from "next/link";

export function Button({
  className,
  children,
  href,
  size = "md",
}: {
  className: string;
  children: ReactNode;
  href: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Link
      className={[
        "bg-rose-600 uppercase inline-block font-bold tracking-very-wide hover:bg-rose-700",
        size === "sm"
          ? "text-sm px-4 py-1"
          : size === "md"
          ? "text-base px-8 py-2"
          : "text-lg",
        className,
      ].join(" ")}
      href={href}
    >
      {children}
    </Link>
  );
}
