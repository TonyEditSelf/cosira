import Link from "next/link";
import NavBar from "@/comps/NavBar";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import ThemeToggle from "@/comps/ThemeToggle";
import NavLogoHome from "@/comps/NavLogoHome";

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
      <body className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
        >
          <header>
            <nav className="flex justify-between py-3 px-10 ">
              <NavLogoHome />

              <div
                className={`flex gap-10 ${dm_sans.className} text-[18px] pb-2 font-[300] border-b border-[var(--muted)]`}
              >
                <ThemeToggle />

                <NavBar />
              </div>
            </nav>
          </header>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
