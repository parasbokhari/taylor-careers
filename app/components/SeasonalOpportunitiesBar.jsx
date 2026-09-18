const SEASONAL_OPPORTUNITIES_URL =
  "https://olivia.paradox.ai/co/Taylor1/SeasonalOpportunities";

export default function SeasonalOpportunitiesBar() {
  if (process.env.SEASONAL_OPPORTUNITIES_BAR_ENABLED === "false") {
    return null;
  }

  return (
    <aside
      className="seasonal-opportunities-bar"
      aria-label="Seasonal opportunities"
    >
      <div className="seasonal-opportunities-bar__content">
        <p className="seasonal-opportunities-bar__title u__p m-0 u__f-700">
          Browse Seasonal Opportunities at Taylor
        </p>
        <a
          className="seasonal-opportunities-bar__link u__small u__f-700"
          href={SEASONAL_OPPORTUNITIES_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View Jobs</span>
          <svg
            aria-hidden="true"
            className="seasonal-opportunities-bar__icon"
            width="17"
            height="14"
            viewBox="0 0 17 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.83334 7H13.1667"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 2.91663L13.1667 6.99996L8.5 11.0833"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </aside>
  );
}
