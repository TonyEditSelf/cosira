"use client";

import { useState, useEffect } from "react";

export function useClickOutsideRef(ref, handleEvent) {
  useEffect(() => {
    const handleClickOutsideRef = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleEvent();
      }
    };

    document.addEventListener("mousedown", handleClickOutsideRef);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideRef);
    };
  });
}

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
