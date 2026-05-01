'use client';

import Link from "next/link";
import { buildJobPath, LAST_BOARD_URL_STORAGE_KEY } from "@/app/lib/jobs";

const EXCERPT_LENGTH = 120;

function decodeHtmlEntities(text = "") {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export default function JobCard({ job }) {
  const rawLocation = job.locationsText || job.locations || "";
  const displayLocation = rawLocation.split(" - ")[0].trim() || rawLocation;

  const rawText = (job.jobDescription || "")
    .replace(/<\/?(p|div|br|li|ul|ol|h[1-6]|tr|td|th|blockquote|pre|hr)[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const plainDescription = decodeHtmlEntities(rawText);

  const excerpt =
    plainDescription.length > EXCERPT_LENGTH
      ? plainDescription.substring(0, EXCERPT_LENGTH).trim() + "…"
      : plainDescription;

  const jobUrl = buildJobPath(job);

  const rememberBoardUrl = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      LAST_BOARD_URL_STORAGE_KEY,
      `${window.location.pathname}${window.location.search}`,
    );
  };

  return (
    <div
      className={`c__job-board-embed__job-card position-relative ${jobUrl ? `u__transition u__translate u__cursor-pointer` : ``}`}
    >
      {jobUrl && (
        <Link
          href={jobUrl}
          className="u__full-cover-anchor"
          onClick={rememberBoardUrl}
        >
          <span className="visually-hidden">View Job</span>
        </Link>
      )}
      <div className="c__job-board-embed__job-card__header mb-3">
        <div className="c__job-board-embed__job-card__header__row">
          <div className="c__job-board-embed__job-card__header__col c__job-board-embed__job-card__header__col--left">
            <div className="c__heading-wrapper">
              <span className="c__heading u__small u__f-700 d-block u__text-purple mb-0">
                {job.jobFamilyGroup}
              </span>
            </div>
          </div>
          <div className="c__job-board-embed__job-card__header__col c__job-board-embed__job-card__header__col--right">
            {jobUrl && (
              <Link
                href={jobUrl}
                className="c__job-card__view-link"
                onClick={rememberBoardUrl}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "var(--t-cp-primary-blue)",
                  fontWeight: "700",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                <span>View Job</span>
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5.83337 14.1666L14.1667 5.83331M14.1667 5.83331H5.83337M14.1667 5.83331V14.1666"
                    stroke="#2458F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="c__job-board-embed__job-card__body mb-3">
        <div className="c__heading-wrapper mb-2">
          <h3 className="c__heading u__h5 u__f-700 d-block u__heading-color--primary mb-0">
            {job.title}
          </h3>
        </div>
        {excerpt && (
          <div className="c__description-wrapper">
            <p className="mb-0 u__p">{excerpt}</p>
          </div>
        )}
      </div>

      <div className="c__job-board-embed__job-card__footer">
        <div className="c__job-board-embed__job-card__footer__row">
          <div className="c__job-board-embed__job-card__footer__col">
            <div className="c__job-board-embed__job-card__meta c__job-board-embed__job-card__meta--location">
              <div className="c__job-board-embed__job-card__meta__icon-wrapper">
                <figure className="m-0 d-inline">
                  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                    <path
                      d="M9.99998 10.4167C11.3807 10.4167 12.5 9.2974 12.5 7.91669C12.5 6.53598 11.3807 5.41669 9.99998 5.41669C8.61927 5.41669 7.49998 6.53598 7.49998 7.91669C7.49998 9.2974 8.61927 10.4167 9.99998 10.4167Z"
                      stroke="#505457"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.99998 18.3334C11.6666 15 16.6666 12.8486 16.6666 8.33335C16.6666 4.65146 13.6819 1.66669 9.99998 1.66669C6.31808 1.66669 3.33331 4.65146 3.33331 8.33335C3.33331 12.8486 8.33331 15 9.99998 18.3334Z"
                      stroke="#505457"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </figure>
              </div>
              <div className="c__job-board-embed__job-card__meta__label-wrapper">
                <span className="u__p">{displayLocation}</span>
              </div>
            </div>
          </div>

          {job.timeType && (
            <div className="c__job-board-embed__job-card__footer__col">
              <div className="c__job-board-embed__job-card__meta c__job-board-embed__job-card__meta--position-type">
                <div className="c__job-board-embed__job-card__meta__icon-wrapper">
                  <figure className="m-0 d-inline">
                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 5.00002V10L13.3334 11.6667M18.3334 10C18.3334 14.6024 14.6024 18.3334 10 18.3334C5.39765 18.3334 1.66669 14.6024 1.66669 10C1.66669 5.39765 5.39765 1.66669 10 1.66669C14.6024 1.66669 18.3334 5.39765 18.3334 10Z"
                        stroke="#505457"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </figure>
                </div>
                <div className="c__job-board-embed__job-card__meta__label-wrapper">
                  <span className="u__p">{job.timeType}</span>
                </div>
              </div>
            </div>
          )}

          {job.postedOn && (
            <div className="c__job-board-embed__job-card__footer__col u__show-after-768 ms-md-auto">
              <div className="c__job-board-embed__job-card__meta">
                <div className="c__job-board-embed__job-card__meta__label-wrapper">
                  <span className="u__p" style={{ fontSize: "13px", color: "#A8A9AB" }}>
                    {job.postedOn}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
