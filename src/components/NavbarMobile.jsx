"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { navMobileElements } from "@/app/data/navMobileElements";
import NavLinkIsActive from "./NavLinkIsActive";
import { HiChevronDown } from "react-icons/hi2";

export default function NavbarMobile({ setMobileMenuOpen }) {
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
    <div ref={dropdownRef}>
      {navMobileElements.map((element) => {
        if (element.submenu) {
          const isActive = isSubmenuActive(element.submenu);

          return (
            <div key={element.label}>
              <button
                onClick={() => toggleDropdown(element.label)}
                className={`w-full text-left py-2 px-3 flex items-center justify-between hover:bg-[var(--hover-bg)] rounded-md transition-colors ${
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
                <div className="pl-4 space-y-1">
                  {element.submenu.map((item) => (
                    <NavLinkIsActive
                      href={item.path}
                      key={item.path}
                      extraClasses="block py-2 px-3 rounded-md text-sm"
                      onClick={() => {
                        setOpenDropdown(null);
                        setMobileMenuOpen(false);
                      }}
                      showTickOnActive={true}
                    >
                      {item.label}
                    </NavLinkIsActive>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <NavLinkIsActive
            href={element.path}
            key={element.path}
            extraClasses="py-2 px-3 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            {element.label}
          </NavLinkIsActive>
        );
      })}
    </div>
  );
}
