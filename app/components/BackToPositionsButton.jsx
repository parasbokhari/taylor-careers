"use client";

import { useRouter } from "next/navigation";
import { LAST_BOARD_URL_STORAGE_KEY } from "@/app/lib/jobs";

export default function BackToPositionsButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="c__job-detail__back-link"
      onClick={() => {
        const storedBoardUrl = window.sessionStorage.getItem(
          LAST_BOARD_URL_STORAGE_KEY,
        );
        if (storedBoardUrl) {
          router.push(storedBoardUrl);
          return;
        }
        router.push("/");
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>All Positions</span>
    </button>
  );
}
