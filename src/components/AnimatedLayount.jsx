"use client";
import NavbarDesktop from "@/components/NavbarDesktop";
import { DM_Sans } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import NavLogoHome from "@/components/NavLogoHome";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
});

export default function AnimatedLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${dm_sans.className}`}>
      <header className="nav-header flex-shrink-0">
        <nav className="nav-bar flex items-center justify-between px-6 py-3 lg:px-10">
          {/* Left: hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <NavLogoHome />
          </div>

          {/* Right: desktop nav + theme toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1 text-[15px] font-[300]">
              <NavbarDesktop />
            </div>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <AnimatePresence mode="wait">
        <main key={pathname} className="flex-1 min-h-0 overflow-hidden">
          {children}
        </main>
      </AnimatePresence>
    </div>
  );
}