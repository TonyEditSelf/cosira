"use client";
import NavLinkIsActive from "./NavLinkIsActive";
import { navElements } from "@/app/data/navElements";

export default function NavBar() {
  return navElements.map((element) => (
    <NavLinkIsActive extraClasses="px-2" href={element.path} key={element.path}>
      {element.label}
    </NavLinkIsActive>
  ));
}
