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
      className={`${
        isActive && !showTickOnActive
          ? "border border-[var(--brand)] rounded-tl-lg rounded-br-lg text-[var(--foreground)]"
          : ""
      } ${extraClasses} ${
        showTickOnActive && isActive ? "flex items-center justify-between" : ""
      }`}
    >
      {children}
      {showTickOnActive && isActive && (
        <HiCheck className="text-lg text-[var(--foreground)]" />
      )}
    </Link>
  );
}
