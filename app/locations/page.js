import LocationDirectory from "@/app/components/LocationDirectory";
import { getStatesWithJobCounts } from "@/app/lib/locationContent";
import { fetchJobs } from "@/app/lib/jobs";
import { buildSeoMetadata } from "@/app/lib/seo";

export const revalidate = 900;

export const metadata = buildSeoMetadata({
  title: "Browse Jobs by Location | Taylor Careers",
  description:
    "Explore Taylor jobs by state and city. Find career opportunities at Taylor.",
  path: "/locations",
});

export default async function LocationsPage() {
  const jobs = await fetchJobs();
  return <LocationDirectory entries={getStatesWithJobCounts(jobs)} />;
}
