"use client";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useHooks";

export default function ThemeToggle() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="theme-toggle p-1.5 rounded-md"
      aria-label="Toggle theme"
    >
      <span className="theme-toggle__icon">
        {theme === "light" ? <HiOutlineMoon className="text-lg" /> : <HiOutlineSun className="text-lg" />}
      </span>
    </button>
  );
}