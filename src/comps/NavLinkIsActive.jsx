"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavLinkIsActive({ href, children, extraClasses = "" }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${
        isActive ? "bg-[var(--brand)] text-white font-bold" : ""
      } ${extraClasses}`}
    >
      {children}
    </Link>
  );
}
