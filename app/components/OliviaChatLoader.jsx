"use client";

import { useEffect } from "react";

const OLIVIA_SCRIPT_ID = "olivia-chat-widget";
const OLIVIA_BASE_URL = "https://olivia.paradox.ai";
const OLIVIA_KEY = "ntsdvrniivyclwbjiojx";
const OLIVIA_WIDGET_SRC =
  "https://dokumfe7mps0i.cloudfront.net/static/site/js/widget-client.js";

const interactionEvents = [
  "pointerdown",
  "pointermove",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
];

export default function OliviaChatLoader() {
  useEffect(() => {
    let hasLoaded = false;

    const loadOliviaChat = () => {
      if (hasLoaded || document.getElementById(OLIVIA_SCRIPT_ID)) {
        return;
      }

      hasLoaded = true;
      window.oliviaChatData = window.oliviaChatData || [];
      window.oliviaChatBaseUrl = OLIVIA_BASE_URL;
      window.oliviaChatData.push(["setKey", OLIVIA_KEY]);
      window.oliviaChatData.push(["start"]);

      const script = document.createElement("script");
      script.id = OLIVIA_SCRIPT_ID;
      script.type = "text/javascript";
      script.async = true;
      script.src = OLIVIA_WIDGET_SRC;
      script.onload = () => {
        console.log("Careers Chat script loaded.");
      };
      script.onerror = () => {
        console.warn("Careers Chat script failed to load.");
      };
      document.head.appendChild(script);
    };

    const handleFirstInteraction = () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });

      loadOliviaChat();
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleFirstInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });
    };
  }, []);

  return null;
}
