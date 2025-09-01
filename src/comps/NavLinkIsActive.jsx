"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavLinkIsActive({
  href,
  children,
  extraClasses = "",
  onClick,
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${
        isActive ? "bg-[var(--brand)] text-white font-bold" : ""
      } ${extraClasses}`}
    >
      {children}
    </Link>
  );
}
