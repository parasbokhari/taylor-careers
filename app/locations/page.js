import LocationDirectory from "@/app/components/LocationDirectory";
import { getLocationStates } from "@/app/lib/locationContent";
import { buildSeoMetadata } from "@/app/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Browse Jobs by Location | Taylor Careers",
  description:
    "Explore Taylor jobs by state and city. Find career opportunities at Taylor.",
  path: "/locations",
});

export default function LocationsPage() {
  return <LocationDirectory entries={getLocationStates()} />;
}
