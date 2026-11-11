import assert from "node:assert/strict";
import { test } from "node:test";
import { extractState } from "../app/lib/jobState.js";
import { jobMatchesCityState } from "../app/lib/jobLocation.js";

test("state filtering recognizes complete Workday addresses and exact remote labels", () => {
  for (const [label, state] of [
    ["MN-Fridley-5601 East River Road", "MN"],
    ["NJ-Monroe Twp.-7 Costco Way", "NJ"],
    ["MN-North Mankato-1750 Northway Drive", "MN"],
    ["MN-North Mankato-1825 Commerce Drive", "MN"],
    ["MN-Mankato-150 Kingswood Drive", "MN"],
    ["NY-Amsterdam-166 Wallins Corners Road", "NY"],
    ["ID-Remote", "ID"],
    ["MN-Remote", "MN"],
  ]) {
    assert.equal(extractState(label), state, label);
  }
});

test("existing city labels and multi-location primary-state behavior stay intact", () => {
  for (const label of ["New York, NY", "New York, NY - Taylor", "New York, NY -Jon Michael Design, Inc."]) {
    assert.equal(extractState(label), "NY", label);
  }
  assert.equal(extractState("Eden Prairie, MN - Taylor Corporation, More..."), "MN");
  assert.equal(extractState("OH-Remote; TX-Remote; GA-Remote; Eden Prairie, MN - Taylor Corporation"), "MN");
});

test("unexpected prefixes and incomplete labels are rejected", () => {
  for (const label of ["", "ZZ-Remote", "ZZ-Monroe-7 Costco Way", "NJ-Monroe Twp.", "NJ-Monroe Twp.-", "NJ--7 Costco Way", "NJ-Monroe Twp.-   ", "ID-Remote extra", "id-Remote", "ID-Remote; MN-Remote", "ID-Remote\nextra"]) {
    assert.equal(extractState(label), null, label);
  }
});

test("recognizing a remote state does not assign the job to a city", () => {
  assert.equal(extractState("NY-Remote"), "NY");
  assert.equal(jobMatchesCityState({ locations: "NY-Remote" }, "New York", "NY"), false);
  assert.equal(jobMatchesCityState({ locations: "ID-Remote" }, "Rexburg", "ID"), false);
});
