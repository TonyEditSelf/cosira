import { useState, useEffect } from "react";

export const useLocalStorage = (key, defaultValue) => {
  const getLocalStorage = (key, defaultValue) => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? saved : defaultValue;
    } catch (error) {
      console.warn("localStorage access failed:", error);
      return defaultValue;
    }
  };

  const setLocalStorage = (key, value) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("localStorage write failed:", error);
    }
  };

  const [value, setValue] = useState(() => getLocalStorage(key, defaultValue));

  useEffect(() => {
    setLocalStorage(key, value);
  }, [key, value]);

  return [value, setValue];
};
