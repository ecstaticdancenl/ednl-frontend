import { useRouter } from "next/router";
import Link from "next/link";

export function NavItem({ href, children }: { href: string; children: any }) {
  const router = useRouter();

  return (
    <Link className={"underline_animated md:text-base text-4xl"} href={href}>
      {children}
    </Link>
  );
}
