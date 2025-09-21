"use client";

// import { useState, useEffect } from "react";
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
      className="text-2xl cursor-pointer lg:text-2xl border border-[var(--navBorder)] rounded-tl-md rounded-br-md p-1"
    >
      {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />}
    </button>
  );
}
