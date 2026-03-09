"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HiCheck } from "react-icons/hi2";

export default function NavLinkIsActive({
  href,
  children,
  extraClasses = "",
  onClick,
  showTickOnActive = false,
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        nav-link relative group
        ${isActive && !showTickOnActive ? "nav-link--active" : ""}
        ${showTickOnActive && isActive ? "flex items-center justify-between nav-link--tick-active" : ""}
        ${extraClasses}
      `}
    >
      {!showTickOnActive && (
        <span className="nav-link__underline" />
      )}
      {children}
      {showTickOnActive && isActive && (
        <HiCheck className="text-sm text-[var(--brand)] ml-2" />
      )}
    </Link>
  );
}