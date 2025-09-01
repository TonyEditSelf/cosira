"use client";

import { useState, useEffect } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-2xl "
    >
      {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />}
    </button>
  );
}
