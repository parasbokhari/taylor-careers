"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6";
const TAG_CLASS = "heading-tag";

function removeHeadingTags() {
  document.querySelectorAll(`.${TAG_CLASS}`).forEach((tag) => tag.remove());
}

function addMissingHeadingTags() {
  document.querySelectorAll(HEADING_SELECTOR).forEach((heading) => {
    if (heading.querySelector(`:scope > .${TAG_CLASS}`)) return;

    const tag = heading.tagName;
    const label = document.createElement("span");

    label.className = TAG_CLASS;
    label.textContent = `[${tag}]`;
    label.style.color = "red";
    label.style.webkitTextFillColor = "red";

    heading.prepend(label);
  });
}

export default function HeadingTagDebugger() {
  const searchParams = useSearchParams();
  const shouldShowHeadingTags = searchParams.get("show_heading_tags") === "true";

  useEffect(() => {
    if (!shouldShowHeadingTags) {
      removeHeadingTags();
      return;
    }

    addMissingHeadingTags();

    const observer = new MutationObserver(() => {
      addMissingHeadingTags();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      removeHeadingTags();
    };
  }, [shouldShowHeadingTags]);

  return null;
}
