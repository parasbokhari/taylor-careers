import { jobMatchesCityState } from "./jobLocation.js";
import { US_STATES } from "./jobState.js";

export function cleanLocationLabel(value = "") {
  return value
    .replace(/\s*,?\s*More(?:\.{1,3}|…)?$/i, "")
    .split(" - ")[0]
    .trim();
}

function normalize(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function getJobLocations(job) {
  const fullLocations = [...new Set((job.locations || "")
    .split(";")
    .map((location) => location.trim())
    .filter(Boolean))];
  const primary = (job.Job_Requisition_Primary_Location || "").trim();
  const summary = cleanLocationLabel(job.locationsText || "");
  let primaryLabel;

  if (primary) {
    primaryLabel = fullLocations.find((label) => normalize(label) === normalize(primary));
    // Workday identifies the primary facility by address, while the readable
    // list often identifies it by city and company. Reuse that label only
    // when the primary city has one unambiguous match.
    const address = primary.match(/^([A-Z]{2})-([^-]+)-.+$/);
    if (!primaryLabel && address && US_STATES[address[1]]) {
      const matches = fullLocations.filter((label) =>
        jobMatchesCityState({ locations: label }, address[2].trim(), address[1]),
      );
      if (matches.length === 1) primaryLabel = matches[0];
    }
    primaryLabel ||= primary;
  } else if (summary) {
    primaryLabel = fullLocations.find((label) =>
      normalize(cleanLocationLabel(label)) === normalize(summary),
    ) || summary;
  } else {
    primaryLabel = fullLocations[0];
  }

  return [...new Set([primaryLabel, ...fullLocations].filter(Boolean))];
}
