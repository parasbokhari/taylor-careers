"use client";

import { useEffect } from "react";

const HUBSPOT_SCRIPT_ID = "hs-script-loader";
const HUBSPOT_SCRIPT_SRC = "https://js.hs-scripts.com/6858527.js";

function analyticsIsAllowed(consent) {
  if (Object.prototype.hasOwnProperty.call(consent?.categories || {}, "analytics")) {
    return consent.categories.analytics === true;
  }

  return consent?.allowed === true;
}

export default function HubSpotConsentLoader({ onAnalyticsConsentChange }) {
  useEffect(() => {
    const privacyQueue = (window._hsp = window._hsp || []);

    privacyQueue.push([
      "addPrivacyConsentListener",
      (consent) => {
        onAnalyticsConsentChange(analyticsIsAllowed(consent));
      },
    ]);

    if (!document.getElementById(HUBSPOT_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = HUBSPOT_SCRIPT_ID;
      script.type = "text/javascript";
      script.async = true;
      script.defer = true;
      script.src = HUBSPOT_SCRIPT_SRC;
      document.head.appendChild(script);
    }
  }, [onAnalyticsConsentChange]);

  return null;
}
