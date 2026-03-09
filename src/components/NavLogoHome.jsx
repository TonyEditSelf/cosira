"use client";

import NavbarMobile from "./NavbarMobile";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { useState } from "react";
import { CgMenuGridR } from "react-icons/cg";
import { FaRegWindowClose } from "react-icons/fa";
import NavBar from "./NavbarDesktop";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["900"],
});

export default function NavLogoHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden nav-mobile-open-btn p-1.5 rounded-md"
        aria-label="Open menu"
      >
        <CgMenuGridR className="text-2xl" />
      </button>

      {/* Mobile menu overlay */}
      <div className={`mobile-overlay lg:hidden ${mobileMenuOpen ? "mobile-overlay--open" : ""}`}>
        <div className="mobile-overlay__panel">
          <div className="mobile-overlay__header flex items-center justify-between px-6 py-4 mb-4">
            {/* Logo repeated in panel */}
            <Link
              href={"/"}
              className={`${orbitron.className} text-sm font-[900] text-[var(--brand)]`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="border-l-2 border-t-2 border-b-2 rounded-tl-lg border-[var(--brand)] px-1.5 py-0.5">TO</span>
              <span className="border-2 border-[var(--brand)] px-1.5 py-0.5">FAB</span>
              <span className="border-r-2 border-t-2 border-b-2 border-[var(--brand)] rounded-br-lg px-1.5 py-0.5">ZA</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="nav-mobile-close-btn p-1.5 rounded-md"
              aria-label="Close menu"
            >
              <FaRegWindowClose className="text-xl opacity-70" />
            </button>
          </div>

          <NavbarMobile setMobileMenuOpen={setMobileMenuOpen} />
        </div>
      </div>

      {/* Logo */}
      <Link
        href={"/"}
        className={`${orbitron.className} text-[15px] lg:text-[17px] font-[900] text-[var(--brand)] nav-logo`}
      >
        <span className="border-l-2 border-t-2 border-b-2 rounded-tl-xl border-[var(--brand)] px-2 py-1">TO</span>
        <span className="border-2 border-[var(--brand)] px-2 py-1">FAB</span>
        <span className="border-r-2 border-t-2 border-b-2 border-[var(--brand)] rounded-br-xl px-2 py-1">ZA</span>
      </Link>
    </>
  );
}