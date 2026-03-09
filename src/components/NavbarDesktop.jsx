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
    <div ref={dropdownRef} className="flex items-center gap-1">
      {navDesktopElements.map((element) => {
        const isActive = isSubmenuActive(element.submenu);
        const isOpen = openDropdown === element.label;

        return (
          <div key={element.label} className="relative">
            <button
              onClick={() => toggleDropdown(element.label)}
              className={`
                nav-dropdown-trigger
                px-3 py-1.5 flex items-center gap-1.5 rounded-md text-sm font-[300]
                transition-all duration-200
                ${isActive ? "nav-dropdown-trigger--active" : ""}
                ${isOpen ? "nav-dropdown-trigger--open" : ""}
              `}
            >
              {element.label}
              <HiChevronDown
                className={`text-xs opacity-60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="nav-dropdown absolute top-full left-0 mt-2 min-w-[200px] z-50">
                <div className="nav-dropdown__inner py-1.5">
                  {element.submenu.map((item, i) => (
                    <NavLinkIsActive
                      key={item.path}
                      href={item.path}
                      extraClasses="nav-dropdown__item block px-4 py-2 text-sm"
                      onClick={() => setOpenDropdown(null)}
                      showTickOnActive={true}
                    >
                      {item.label}
                    </NavLinkIsActive>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button className="nav-kebab-btn ml-2 p-1.5 rounded-md">
        <CiMenuKebab className="text-lg" />
      </button>
    </div>
  );
}