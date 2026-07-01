"use client";

import { useEffect } from "react";

const OLIVIA_SCRIPT_ID = "olivia-chat-widget";
const OLIVIA_BASE_URL = "https://olivia.paradox.ai";
const OLIVIA_KEY = "ntsdvrniivyclwbjiojx";
const OLIVIA_WIDGET_SRC =
  "https://dokumfe7mps0i.cloudfront.net/static/site/js/widget-client.js";
const OLIVIA_INIT_CHECK_URL = `${OLIVIA_BASE_URL}/widget_init_checkup/${OLIVIA_KEY}`;
const OLIVIA_INIT_TIMEOUT_MS = 8000;

const interactionEvents = ["pointerdown", "keydown", "scroll", "touchstart"];

export default function OliviaChatLoader() {
  useEffect(() => {
    let hasLoaded = false;
    const abortController = new AbortController();
    let timeoutId;

    const checkOliviaConfig = async () => {
      timeoutId = window.setTimeout(() => {
        abortController.abort();
      }, OLIVIA_INIT_TIMEOUT_MS);

      const response = await fetch(OLIVIA_INIT_CHECK_URL, {
        credentials: "include",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Olivia init check failed with ${response.status}`);
      }

      return response.json();
    };

    const loadOliviaChat = async () => {
      if (hasLoaded || document.getElementById(OLIVIA_SCRIPT_ID)) {
        return;
      }

      hasLoaded = true;

      try {
        await checkOliviaConfig();
      } catch (error) {
        console.warn(
          "Careers Chat did not start. Olivia/Paradox rejected the current domain or the init check failed.",
          error,
        );
        return;
      } finally {
        window.clearTimeout(timeoutId);
      }

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

      void loadOliviaChat();
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleFirstInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      abortController.abort();
      window.clearTimeout(timeoutId);
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });
    };
  }, []);

  return null;
}
