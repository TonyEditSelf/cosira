import { navMobileElements } from "@/app/data/navMobileElements";
import Link from "next/link";
import NavLinkIsActive from "./NavLinkIsActive";

export default function NavbarMobile({ setMobileMenuOpen }) {
  return (
    <>
      {navMobileElements.map((element) => (
        <NavLinkIsActive
          href={element.path}
          key={element.path}
          extraClasses="py-2 px-3 rounded-md"
          onClick={() => setMobileMenuOpen(false)}
        >
          {element.label}
        </NavLinkIsActive>
      ))}
    </>
  );
}
