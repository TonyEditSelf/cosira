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

  const isSubmenuActive = (submenu) => {
    return submenu.some((item) => item.path === pathname);
  };

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
    <div ref={dropdownRef} className="mobile-nav w-full px-2 space-y-1">
      {navMobileElements.map((element) => {
        if (element.submenu) {
          const isActive = isSubmenuActive(element.submenu);
          const isOpen = openDropdown === element.label;

          return (
            <div key={element.label} className="mobile-nav__group">
              <button
                onClick={() => toggleDropdown(element.label)}
                className={`
                  mobile-nav__trigger
                  w-full text-left py-2.5 px-4 flex items-center justify-between
                  rounded-lg text-sm font-[300] transition-all duration-200
                  ${isActive ? "mobile-nav__trigger--active" : ""}
                `}
              >
                {element.label}
                <HiChevronDown
                  className={`text-xs opacity-50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div className={`mobile-nav__submenu overflow-hidden transition-all duration-300 ${isOpen ? "mobile-nav__submenu--open" : ""}`}>
                <div className="pl-4 pt-1 pb-1 space-y-0.5">
                  {element.submenu.map((item) => (
                    <NavLinkIsActive
                      href={item.path}
                      key={item.path}
                      extraClasses="mobile-nav__subitem block py-2 px-3 rounded-md text-sm"
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
              </div>
            </div>
          );
        }

        return (
          <NavLinkIsActive
            href={element.path}
            key={element.path}
            extraClasses="mobile-nav__item block py-2.5 px-4 rounded-lg text-sm font-[300]"
            onClick={() => setMobileMenuOpen(false)}
          >
            {element.label}
          </NavLinkIsActive>
        );
      })}
    </div>
  );
}