"use client";

import { useEffect } from "react";

const KEYBOARD_NAVIGATION_ATTRIBUTE = "data-keyboard-navigation";

export default function KeyboardNavigationTracker() {
  useEffect(() => {
    const root = document.documentElement;

    const handleKeyDown = (event) => {
      if (event.key === "Tab") {
        root.setAttribute(KEYBOARD_NAVIGATION_ATTRIBUTE, "true");
      }
    };

    const handlePointerDown = () => {
      root.removeAttribute(KEYBOARD_NAVIGATION_ATTRIBUTE);
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      root.removeAttribute(KEYBOARD_NAVIGATION_ATTRIBUTE);
    };
  }, []);

  return null;
}
