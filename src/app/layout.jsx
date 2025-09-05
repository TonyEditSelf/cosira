import Link from "next/link";
import NavbarDesktop from "@/components/NavbarDesktop";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import NavLogoHome from "@/components/NavLogoHome";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  // weight: ["100", "400", "500", "600", "700", "800", "900", "1000"],
  weight: ["100", "200", "300", "400"],
});

export const metadata = {
  title: "Tofabzo - Brand Building Tools",
  description: "A collection of tools for color palette generation",
};

export default function RootLayount({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500 h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <header>
            <nav className="flex border border-[var(--border)] px-7 items-center justify-between py-3 lg:px-10 lg:border-0">
              <NavLogoHome />

              <ThemeToggle />

              <div
                className={`hidden lg:flex justify-center items-center gap-5 ${dm_sans.className} text-[16px] pb-2 font-[300] `}
              >
                <NavbarDesktop />
              </div>
            </nav>
          </header>

          <main className="flex-1"> {children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
