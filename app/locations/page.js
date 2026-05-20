import Link from "next/link";
import {
  buildLocationPath,
  fetchJobs,
  getJobLocations,
} from "@/app/lib/jobs";

export const metadata = {
  title: "Job Locations | Taylor Careers",
  description: "Browse Taylor careers by location.",
  alternates: {
    canonical: "/locations",
  },
};

export default async function LocationsPage() {
  const jobs = await fetchJobs();
  const locations = getJobLocations(jobs);

  return (
    <section className="c__categories-index">
      <div className="container">
        <div className="c__categories-index__header">
          <h1 className="c__heading u__h3 u__f-700 d-block u__heading-color--primary mb-0">
            Job Locations
          </h1>
        </div>
        <div className="c__categories-index__grid">
          {locations.map((location) => {
            const path = buildLocationPath(location);
            if (!path) return null;

            return (
              <Link
                className="c__categories-index__link"
                href={path}
                key={location}
              >
                {location}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
