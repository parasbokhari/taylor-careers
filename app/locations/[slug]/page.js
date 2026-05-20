import { notFound } from "next/navigation";
import Link from "next/link";
import JobBoard from "@/app/components/JobBoard";
import {
  EMPTY_FILTERS,
  buildLocationPath,
  fetchJobs,
  getJobsForLocation,
  getLocationBySlug,
  getLocationFilterValues,
} from "@/app/lib/jobs";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const jobs = await fetchJobs();
  const location = getLocationBySlug(jobs, slug);

  if (!location) {
    return { title: "Location Not Found | Taylor" };
  }

  return {
    title: `${location} Jobs | Taylor Careers`,
    description: `Explore jobs in ${location} at Taylor.`,
    alternates: {
      canonical: buildLocationPath(location),
    },
  };
}

export default async function LocationPage({ params }) {
  const { slug } = await params;
  const jobs = await fetchJobs();
  const location = getLocationBySlug(jobs, slug);

  if (!location) notFound();

  const locationJobs = getJobsForLocation(jobs, location);
  if (locationJobs.length === 0) notFound();

  const locationFilter = {
    ...EMPTY_FILTERS,
    location: getLocationFilterValues(jobs, location),
  };

  return (
    <>
      <section className="c__category-hero">
        <div className="container">
          <Link href="/locations" className="c__category-hero__back-link">
            Back
          </Link>
          <h1 className="c__category-hero__title">
            Jobs in {location} at Taylor
          </h1>
        </div>
      </section>
      <JobBoard
        initialJobs={jobs}
        initialFilters={locationFilter}
        showInitialFilterLoading={false}
        urlFilterDefaults={locationFilter}
      />
    </>
  );
}
