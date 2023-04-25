import { ReactNode } from "react";

export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={[
        className,
        "text-sm text-blue-200/75 uppercase tracking-widest font-semibold pointer-events-auto",
      ].join(" ")}
    >
      {children}
    </p>
  );
}
