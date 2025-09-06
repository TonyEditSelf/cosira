"use client";
import NavbarDesktop from "@/components/NavbarDesktop";
import { DM_Sans } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import NavLogoHome from "@/components/NavLogoHome";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  // weight: ["100", "400", "500", "600", "700", "800", "900", "1000"],
  weight: ["100", "200", "300", "400"],
});

export default function AnimatedLayount({ children }) {
  const pathname = usePathname();

  return (
    <>
      <header>
        <nav className="flex border border-[var(--border)] px-7 items-center justify-between py-2 lg:px-10 lg:border-0">
          <NavLogoHome />

          <ThemeToggle />

          <div
            className={`hidden lg:flex justify-center items-center gap-5 ${dm_sans.className} text-[16px] font-[300] `}
          >
            <NavbarDesktop />
          </div>
        </nav>
      </header>
      <AnimatePresence>
        <main key={pathname} className="flex-1">
          {children}
        </main>
      </AnimatePresence>
    </>
  );
}
