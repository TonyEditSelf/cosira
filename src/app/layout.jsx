import "./globals.css";
import AnimatedLayount from "@/components/AnimatedLayount";
import { ThemeProvider } from "next-themes";
import { ColorPaletteContextProvider } from "./(palettes)/ColorContext";
// ⬆ important: import provider from palettes folder

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
          <ColorPaletteContextProvider>
            <AnimatedLayount>{children}</AnimatedLayount>
          </ColorPaletteContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
