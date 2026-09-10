"use client";

import { useEffect } from "react";

const HUBSPOT_SCRIPT_ID = "hs-script-loader";
const HUBSPOT_SCRIPT_SRC = "https://js.hs-scripts.com/6858527.js";
const DECLINE_KEY = "taylor_tracking_declined";
const DECLINE_MAX_AGE = 180 * 24 * 60 * 60;
const EXCLUDED_PATHS = ["/privacy-policy"];

const ESSENTIAL_COOKIE_NAMES = [
  DECLINE_KEY,
  "__cfruid",
  "__cfuvid",
  "__cf_bm",
  "__hs_opt_out",
  "__hs_do_not_track",
  "__hs_initial_opt_in",
  "__hs_cookie_cat_pref",
  "__hs_gpc_banner_dismiss",
  "__hs_notify_banner_dismiss",
  "hs_ab_test",
  "hs-messages-is-open",
  "hs-messages-hide-welcome-message",
  "__ai_widget_probed",
  "__hsmem",
  "hs-membership-csrf",
  "hs-membership-logout-referer",
];
const ESSENTIAL_COOKIE_PATTERNS = [/^\d+_key$/];
const ESSENTIAL_LOCAL_STORAGE_KEYS = [DECLINE_KEY, "pod_cart"];
const ESSENTIAL_LOCAL_STORAGE_PATTERNS = [/^hs\.superstore\.laboratory\./];
const ESSENTIAL_SESSION_STORAGE_KEYS = [];
const ESSENTIAL_SESSION_STORAGE_PATTERNS = [/^hs\.superstore\.laboratory\./];

function normalizePath(path) {
  const normalizedPath = String(path || "/").toLowerCase();
  return normalizedPath.length > 1
    ? normalizedPath.replace(/\/+$/, "")
    : normalizedPath;
}

function cookieDomains() {
  const domains = [""];
  const labels = window.location.hostname.split(".");

  for (let index = 0; index < labels.length - 1; index += 1) {
    const domain = labels.slice(index).join(".");
    domains.push(domain, `.${domain}`);
  }

  return domains;
}

function cookiePaths() {
  const paths = ["/"];
  let path = window.location.pathname;

  while (path.length > 1) {
    paths.push(path, `${path.replace(/\/$/, "")}/`);
    path = path.slice(0, path.lastIndexOf("/"));
  }

  return paths;
}

function expireCookie(name) {
  cookieDomains().forEach((domain) => {
    cookiePaths().forEach((path) => {
      document.cookie =
        `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; ` +
        `Path=${path}${domain ? `; Domain=${domain}` : ""}; SameSite=Lax` +
        (window.location.protocol === "https:" ? "; Secure" : "");
    });
  });
}

function matchesPreservedValue(value, names, patterns) {
  return names.includes(value) || patterns.some((pattern) => pattern.test(value));
}

function clearStorage(storageName, essentialKeys, essentialPatterns) {
  try {
    const storage = window[storageName];
    const keys = Array.from({ length: storage.length }, (_, index) =>
      storage.key(index),
    );

    keys.forEach((key) => {
      if (
        key &&
        !matchesPreservedValue(key, essentialKeys, essentialPatterns)
      ) {
        storage.removeItem(key);
      }
    });
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
}

function clearNonEssentialStorage() {
  document.cookie.split(";").forEach((part) => {
    const name = part.trim().split("=")[0];

    if (
      name &&
      !matchesPreservedValue(
        name,
        ESSENTIAL_COOKIE_NAMES,
        ESSENTIAL_COOKIE_PATTERNS,
      )
    ) {
      expireCookie(name);
    }
  });

  clearStorage(
    "localStorage",
    ESSENTIAL_LOCAL_STORAGE_KEYS,
    ESSENTIAL_LOCAL_STORAGE_PATTERNS,
  );
  clearStorage(
    "sessionStorage",
    ESSENTIAL_SESSION_STORAGE_KEYS,
    ESSENTIAL_SESSION_STORAGE_PATTERNS,
  );
}

function rememberDecline() {
  const domain = /(^|\.)taylor\.com$/i.test(window.location.hostname)
    ? "; Domain=taylor.com"
    : "";

  document.cookie =
    `${DECLINE_KEY}=1; Path=/; Max-Age=${DECLINE_MAX_AGE}${domain}; ` +
    "SameSite=Lax" +
    (window.location.protocol === "https:" ? "; Secure" : "");

  try {
    window.localStorage.setItem(DECLINE_KEY, "1");
  } catch {
    // The cookie remains the fallback when storage is unavailable.
  }
}

function forgetDecline() {
  expireCookie(DECLINE_KEY);

  try {
    window.localStorage.removeItem(DECLINE_KEY);
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
}

function consentIsFullyDeclined(consent) {
  if (!consent) return false;

  const categories = consent.categories;
  const categoryNames = ["analytics", "advertisement", "functionality"];

  if (
    categories &&
    categoryNames.every((category) =>
      Object.prototype.hasOwnProperty.call(categories, category),
    )
  ) {
    return categoryNames.every((category) => categories[category] !== true);
  }

  return consent.allowed === false;
}

function categoryIsAllowed(consent, category) {
  const categories = consent?.categories;

  if (
    categories &&
    Object.prototype.hasOwnProperty.call(categories, category)
  ) {
    return categories[category] === true;
  }

  return consent?.allowed === true;
}

function initializeConsentTracking() {
  const tracking = (window.taylorConsentTracking =
    window.taylorConsentTracking || {});
  tracking.analyticsConsentListeners =
    tracking.analyticsConsentListeners || new Set();

  if (tracking.initialized) return tracking;

  tracking.initialized = true;
  tracking.currentConsent = null;
  tracking.lastClarityConsent = null;
  tracking.isExcludedPath = () => {
    const currentPath = normalizePath(window.location.pathname);
    return EXCLUDED_PATHS.some(
      (path) => normalizePath(path) === currentPath,
    );
  };
  tracking.clearNonEssentialStorage = clearNonEssentialStorage;

  const notifyAnalyticsConsent = (isAllowed) => {
    tracking.analyticsConsentListeners.forEach((listener) => {
      listener(isAllowed);
    });
  };

  const updateClarityConsent = (consent) => {
    const granted = categoryIsAllowed(consent, "analytics");
    window.clarity =
      window.clarity ||
      function clarityQueue() {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };

    if (tracking.lastClarityConsent === granted) return;
    tracking.lastClarityConsent = granted;

    window.clarity("consentv2", {
      ad_Storage: granted ? "granted" : "denied",
      analytics_Storage: granted ? "granted" : "denied",
    });
  };

  tracking.applyConsent = (consent) => {
    tracking.currentConsent = consent || {};

    if (consentIsFullyDeclined(tracking.currentConsent)) {
      updateClarityConsent({
        categories: { advertisement: false, analytics: false },
      });
      notifyAnalyticsConsent(false);
      rememberDecline();
      tracking.clearNonEssentialStorage();
      return;
    }

    forgetDecline();

    if (tracking.isExcludedPath()) {
      updateClarityConsent({
        categories: { advertisement: false, analytics: false },
      });
      notifyAnalyticsConsent(false);
      return;
    }

    updateClarityConsent(tracking.currentConsent);
    notifyAnalyticsConsent(
      categoryIsAllowed(tracking.currentConsent, "analytics"),
    );
  };

  const privacyQueue = (window._hsp = window._hsp || []);
  privacyQueue.push(["addPrivacyConsentListener", tracking.applyConsent]);

  return tracking;
}

export default function HubSpotConsentLoader({ onAnalyticsConsentChange }) {
  useEffect(() => {
    const tracking = initializeConsentTracking();
    tracking.analyticsConsentListeners.add(onAnalyticsConsentChange);

    if (tracking.currentConsent) {
      onAnalyticsConsentChange(
        !tracking.isExcludedPath() &&
          categoryIsAllowed(tracking.currentConsent, "analytics"),
      );
    }

    if (!document.getElementById(HUBSPOT_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = HUBSPOT_SCRIPT_ID;
      script.type = "text/javascript";
      script.async = true;
      script.defer = true;
      script.src = HUBSPOT_SCRIPT_SRC;
      document.head.appendChild(script);
    }

    return () => {
      tracking.analyticsConsentListeners.delete(onAnalyticsConsentChange);
    };
  }, [onAnalyticsConsentChange]);

  return null;
}
