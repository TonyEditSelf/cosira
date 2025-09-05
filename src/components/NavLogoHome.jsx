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
  // weight: ["400", "700", "800", "900"],
});

export default function NavLogoHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <CgMenuGridR
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden text-4xl"
      />

      {mobileMenuOpen && (
        <div className="absolute top-0 bottom-0 left-0 right-24 bg-[var(--background)] border border-[var(--border)] flex flex-col justify-center items-center gap-3">
          <FaRegWindowClose
            onClick={() => setMobileMenuOpen(false)}
            className="text-4xl font-light absolute top-8 right-8"
          />
          <NavbarMobile setMobileMenuOpen={setMobileMenuOpen} />
        </div>
      )}

      <Link
        href={"/"}
        className={`${orbitron.className} text-md lg:text-[17px] font-[900] text-[var(--brand)]`}
      >
        <span className="border-l-3 border-t-3 border-b-3 rounded-tl-xl border-[var(--brand)] px-2 py-1">
          TO
        </span>
        <span className="border-3 border-[var(--brand)] px-2 py-1">FAB</span>
        <span className="border-r-3 border-t-3 border-b-3 border-[var(--brand)] rounded-br-xl  px-2 py-1">
          ZA
        </span>
      </Link>
    </>
  );
}
