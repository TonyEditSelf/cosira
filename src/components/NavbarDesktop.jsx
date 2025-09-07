"use client";
import NavLinkIsActive from "./NavLinkIsActive";
import { navDesktopElements } from "@/app/data/navDesktopElements";
import { CiMenuKebab } from "react-icons/ci";

export default function NavbarDesktop() {
  return (
    <>
      {navDesktopElements.map((element) => (
        <NavLinkIsActive
          key={element.path}
          href={element.path}
          extraClasses="px-2 py-1"
        >
          {element.label}
        </NavLinkIsActive>
      ))}
      <CiMenuKebab className="text-2xl lg:text-3xl border border-[var(--navBorder)] rounded-tl-md rounded-br-md p-1" />
    </>
  );
}
