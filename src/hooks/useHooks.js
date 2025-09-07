import { useEffect } from "react";

export default function useClickOutsideRef(ref, handleEvent) {
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
