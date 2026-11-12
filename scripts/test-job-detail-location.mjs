import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanLocationLabel, getJobLocations } from "../app/lib/jobDetailLocation.js";

const multiLocationJob = {
  Job_Requisition_Primary_Location: "MN-Eden Prairie-10050 Crosstown Circle, Suite 200",
  locationsText: "Eden Prairie, MN - Taylor Corporation, More...",
  locations: "OH-Remote; TX-Remote; GA-Remote; Eden Prairie, MN - Taylor Corporation",
};

test("the API's primary location leads the readable list without dropping remote options", () => {
  const locations = getJobLocations(multiLocationJob);
  assert.deepEqual(locations, ["Eden Prairie, MN - Taylor Corporation", "OH-Remote", "TX-Remote", "GA-Remote"]);
  assert.equal(cleanLocationLabel(locations[0]), "Eden Prairie, MN");
});

test("exact primary facility and remote labels take precedence over city matching and summary", () => {
  assert.equal(getJobLocations({ ...multiLocationJob, Job_Requisition_Primary_Location: "TX-Remote" })[0], "TX-Remote");
  const primary = "MN-North Mankato-1825 Commerce Drive";
  assert.deepEqual(getJobLocations({ Job_Requisition_Primary_Location: primary, locations: `MN-North Mankato-1750 Northway Drive; ${primary}` }), [primary, "MN-North Mankato-1750 Northway Drive"]);
});

test("missing primary falls back to the summary, then the first full location", () => {
  assert.equal(getJobLocations({ ...multiLocationJob, Job_Requisition_Primary_Location: "" })[0], "Eden Prairie, MN - Taylor Corporation");
  assert.deepEqual(getJobLocations({ locationsText: "Eden Prairie, MN, More..." }), ["Eden Prairie, MN"]);
  assert.deepEqual(getJobLocations({ locations: "ID-Remote; MN-Remote" }), ["ID-Remote", "MN-Remote"]);
  assert.deepEqual(getJobLocations({}), []);
});

test("unmatched or ambiguous primary facilities retain the API value instead of guessing", () => {
  const primary = "MN-North Mankato-1825 Commerce Drive";
  const labels = ["North Mankato, MN - Navitor", "North Mankato, MN - Taylor"];
  assert.deepEqual(getJobLocations({ Job_Requisition_Primary_Location: primary, locations: labels.join("; ") }), [primary, ...labels]);
  assert.deepEqual(getJobLocations({ Job_Requisition_Primary_Location: "NY-Remote", locations: "MN-Remote" }), ["NY-Remote", "MN-Remote"]);
});

test("single-location labels, aliases, and the Jon Michael Design exception stay intact", () => {
  for (const [primary, label] of [
    ["NY-New York-525 7th Ave", "New York, NY -Jon Michael Design, Inc."],
    ["NJ-Monroe Twp.-7 Costco Way", "Monroe Twp., NJ - Taylor Corporation"],
    ["ID-Remote", "ID-Remote"],
  ]) {
    assert.deepEqual(getJobLocations({ Job_Requisition_Primary_Location: primary, locations: label }), [label]);
  }
});
