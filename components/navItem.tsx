import { useRouter } from "next/router";
import Link from "next/link";

export function NavItem({ href, children }: { href: string; children: any }) {
  const router = useRouter();
  return (
    <Link
      className={[
        (router.pathname.startsWith(href) && href !== "/") ||
        router.pathname === href
          ? "underline_animated_active"
          : "",
        "underline_animated md:text-base text-4xl",
      ].join(" ")}
      href={href}
    >
      {children}
    </Link>
  );
}
