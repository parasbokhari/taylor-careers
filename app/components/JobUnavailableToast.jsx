"use client";

import { useEffect, useState } from "react";
import styles from "./JobUnavailableToast.module.scss";

export default function JobUnavailableToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("job_unavailable") === "true") {
      url.searchParams.delete("job_unavailable");
      window.history.replaceState(
        null,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    }

    const timeout = window.setTimeout(() => setVisible(false), 10000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.toast}>
      <p role="status" aria-live="polite" aria-atomic="true">
        <span className={styles.title}>This job is no longer available.</span>{" "}
        <span className={styles.description}>
          Please feel free to browse current open positions.
        </span>
      </p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => setVisible(false)}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 5L15 15M15 5L5 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
