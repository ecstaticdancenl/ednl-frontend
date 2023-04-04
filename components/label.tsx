import { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return (
    <p
      className={
        "text-sm text-blue-gray uppercase tracking-widest font-semibold"
      }
    >
      {children}
    </p>
  );
}
