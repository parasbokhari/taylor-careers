"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

export default function BreadcrumbJsonLd({ json }) {
  const hasInserted = useRef(false);

  useServerInsertedHTML(() => {
    if (hasInserted.current) return null;
    hasInserted.current = true;

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
    );
  });

  return null;
}
