import JobBoard from "@/app/components/JobBoard";
import { fetchJobs, getFiltersFromSearchParams } from "@/app/lib/jobs";

export const metadata = {
  title: "Careers | Taylor",
  description: "Explore open positions at Taylor.",
};

export default async function HomePage({ searchParams }) {
  const jobs = await fetchJobs();
  const resolvedSearchParams = await searchParams;
  const initialFilters = getFiltersFromSearchParams(resolvedSearchParams);

  return <JobBoard initialJobs={jobs} initialFilters={initialFilters} />;
}
