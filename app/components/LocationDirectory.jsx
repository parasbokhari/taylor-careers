import Link from "@/app/components/CustomLink";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { getLocationBreadcrumbs } from "@/app/lib/locationContent";

export default function LocationDirectory({ state, entries }) {
  const title = `Browse Jobs by Location${state ? `: ${state.name}` : ""}`;
  return (
    <div className="location-directory">
      <Breadcrumbs items={getLocationBreadcrumbs(state)} currentPath={state ? `/locations/${state.slug}` : "/locations"} />
      <section className="b__size-md b__u-careers__category-list">
        <div className="container">
          <div className="c__heading-wrapper mb-4 text-center">
            <h1 className="c__heading u__h2 u__f-700 d-block u__heading-color--primary mb-0">{title}</h1>
          </div>
        </div>
        <div className="container mt-4 pt-4">
          <div className="location-directory__grid">
            {entries.map((entry) => (
              <Link className="c__u-careers__category-badge" href={`/locations/${entry.slug}`} key={entry.slug}>
                <span className="location-directory__card-text">
                  <h2 className="c__u-careers__category-badge__label u__h6 u__f-700 mb-0">{entry.city || entry.name}</h2>
                  <span className="u__small">
                    {entry.count} {entry.count === 1 ? "Job" : "Jobs"}
                  </span>
                </span>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
