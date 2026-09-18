import locationPages from "../data/locationPages.json" with { type: "json" };
import { jobMatchesCityState } from "./jobLocation.js";

const STATE_NAMES = {
  AZ: "Arizona", CA: "California", FL: "Florida", GA: "Georgia",
  ID: "Idaho", IL: "Illinois", IN: "Indiana", KY: "Kentucky",
  MA: "Massachusetts", MN: "Minnesota", MO: "Missouri", NV: "Nevada",
  NJ: "New Jersey", NY: "New York", NC: "North Carolina", OH: "Ohio",
  OR: "Oregon", PA: "Pennsylvania", TN: "Tennessee", TX: "Texas",
  VA: "Virginia", WA: "Washington",
};

export function getLocationPages() { return locationPages; }

export function getLocationStates() {
  return [...new Set(locationPages.map((page) => page.state))]
    .map((code) => ({ code, name: STATE_NAMES[code], slug: STATE_NAMES[code].toLowerCase().replaceAll(" ", "-") }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getLocationBySlug(slug) {
  return locationPages.find((page) => page.slug === slug);
}

export function getStateBySlug(slug) {
  return getLocationStates().find((state) => state.slug === slug);
}

export function getCitiesForState(code) {
  return locationPages.filter((page) => page.state === code)
    .sort((a, b) => a.city.localeCompare(b.city));
}

export function getCitiesWithJobCounts(jobs, code) {
  return getCitiesForState(code).map((location) => ({
    ...location,
    count: jobs.filter((job) => jobMatchesLocation(job, location)).length,
  }));
}

export function getStatesWithJobCounts(jobs) {
  return getLocationStates().map((state) => {
    const locations = getCitiesForState(state.code);
    return {
      ...state,
      count: jobs.filter((job) =>
        locations.some((location) => jobMatchesLocation(job, location)),
      ).length,
    };
  });
}

export function getFeaturedLocations(jobs, limit = 6) {
  return locationPages
    .map((location) => ({ location, count: jobs.filter((job) => jobMatchesLocation(job, location)).length }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count || `${a.location.city}, ${a.location.state}`.localeCompare(`${b.location.city}, ${b.location.state}`))
    .slice(0, limit);
}

export function getLocationBreadcrumbs(state, location) {
  return [
    { label: "Careers", href: "https://www.taylor.com/careers" },
    { label: "Browse Taylor Jobs", href: "/" },
    { label: "Browse Jobs by Location", ...(state ? { href: "/locations" } : {}) },
    ...(state ? [{ label: state.name, ...(location ? { href: `/locations/${state.slug}` } : {}) }] : []),
    ...(location ? [{ label: location.city }] : []),
  ];
}

export function jobMatchesLocation(job, location) {
  return jobMatchesCityState(job, location.city, location.state);
}

export function buildLocationSearchResultsPath(location) {
  const query = new URLSearchParams();
  query.set("tcb_location", `${location.city}, ${location.state}`);
  return `/search-results?${query}`;
}
