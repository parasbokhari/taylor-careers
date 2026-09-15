const STATE_NAMES = {
  AZ: "Arizona", CA: "California", FL: "Florida", GA: "Georgia",
  ID: "Idaho", IL: "Illinois", IN: "Indiana", KY: "Kentucky",
  MA: "Massachusetts", MN: "Minnesota", MO: "Missouri", NV: "Nevada",
  NJ: "New Jersey", NY: "New York", NC: "North Carolina", OH: "Ohio",
  OR: "Oregon", PA: "Pennsylvania", TN: "Tennessee", TX: "Texas",
  VA: "Virginia", WA: "Washington",
};

function normalize(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function cityAliases(city, state) {
  return state === "NJ" && city === "Monroe Township"
    ? [city, "Monroe Twp."]
    : [city];
}

function matchesLabel(label, city, state) {
  const clean = label.trim();
  const aliases = cityAliases(city, state).map(normalize);
  const address = clean.match(/^([A-Z]{2})-([^-]+)-.+$/);
  if (address) {
    return address[1] === state && aliases.includes(normalize(address[2]));
  }

  const standard = clean.split(" - ")[0].match(/^(.+?),\s*([^,]+)$/);
  if (!standard) return false;
  return aliases.includes(normalize(standard[1])) &&
    [state, STATE_NAMES[state]].some((name) => normalize(name) === normalize(standard[2]));
}

export function jobMatchesCityState(job, city, state) {
  const raw = job.locations || job.locationsText || "";
  if (typeof raw !== "string") return false;
  return raw.split(";").some((label) => matchesLabel(label, city, state));
}

export function jobMatchesLocationFilter(job, filter) {
  // A city-page link uses the simple "City, ST" label. Existing job-board
  // dropdown choices keep matching their full Workday location label.
  const cityFilter = filter.match(/^(.+?),\s*([A-Z]{2})$/);
  if (cityFilter && STATE_NAMES[cityFilter[2]]) {
    return jobMatchesCityState(job, cityFilter[1], cityFilter[2]);
  }
  return filter === job.locationsText || filter === job.locations ||
    (typeof job.locations === "string" && job.locations.split(";").some((label) => label.trim() === filter));
}
