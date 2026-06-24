"use client";

import Link from "@/app/components/CustomLink";
import { LAST_BOARD_URL_STORAGE_KEY } from "@/app/lib/jobs";

export default function BackToPositionsButton() {
  const useStoredBoardUrl = (event) => {
    const storedBoardUrl = window.sessionStorage.getItem(
      LAST_BOARD_URL_STORAGE_KEY,
    );

    if (storedBoardUrl) {
      event.currentTarget.href = storedBoardUrl;
    }
  };

  return (
    <Link
      className="b__u-careers__job-detail__back-link"
      href="/search-results"
      onClick={useStoredBoardUrl}
    >
      <svg
        width={15}
        height={12}
        viewBox="0 0 15 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.1663 5.83325H0.833008M5.83301 0.833252L0.833008 5.83325L5.83301 10.8333"
          stroke="#475467"
          strokeWidth={1.66667}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Back to All Jobs</span>
    </Link>
  );
}
