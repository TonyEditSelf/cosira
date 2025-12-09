"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NavLinkIsActive from "./NavLinkIsActive";
import { navDesktopElements } from "@/app/data/navDesktopElements";
import { CiMenuKebab } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi2";

export default function NavbarDesktop() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  // Check if any submenu item is active
  const isSubmenuActive = (submenu) => {
    return submenu.some((item) => item.path === pathname);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div ref={dropdownRef} className="flex items-center gap-5">
      {navDesktopElements.map((element) => {
        const isActive = isSubmenuActive(element.submenu);

        return (
          <div key={element.label} className="relative">
            <button
              onClick={() => toggleDropdown(element.label)}
              className={`px-2 py-1 flex items-center gap-1 hover:text-[var(--brand)] transition-colors ${
                isActive
                  ? "border border-[var(--brand)] rounded-tl-lg rounded-br-lg text-[var(--foreground)]"
                  : ""
              }`}
            >
              {element.label}
              <HiChevronDown
                className={`transition-transform ${
                  openDropdown === element.label ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === element.label && (
              <div className="absolute top-full left-0 mt-1 bg-[var(--background)] border border-[var(--navBorder)] rounded-md shadow-lg min-w-[200px] z-50">
                {element.submenu.map((item) => (
                  <NavLinkIsActive
                    key={item.path}
                    href={item.path}
                    extraClasses="block px-4 py-2 hover:bg-[var(--hover-bg)] transition-colors"
                    onClick={() => setOpenDropdown(null)}
                    showTickOnActive={true}
                  >
                    {item.label}
                  </NavLinkIsActive>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <CiMenuKebab className="text-2xl cursor-pointer lg:text-3xl border border-[var(--navBorder)] rounded-tl-md rounded-br-md p-1" />
    </div>
  );
}
