import assert from "node:assert/strict";
import { test } from "node:test";
import { getLocationPages, getLocationStates, getLocationBySlug, getStateBySlug, getCitiesForState, getCitiesWithJobCounts, getStatesWithJobCounts, getFeaturedLocations, getLocationBreadcrumbs, jobMatchesLocation, buildLocationSearchResultsPath } from "../app/lib/locationContent.js";
import { jobMatchesLocationFilter } from "../app/lib/jobLocation.js";
import { getVisiblePhotoIndexes } from "../app/lib/carouselPagination.js";

test("fixed catalog contains 46 unique cities and 22 states with navigable parents", () => {
  const cities = getLocationPages();
  const states = getLocationStates();
  assert.equal(cities.length, 46);
  assert.equal(states.length, 22);
  assert.equal(new Set([...cities, ...states].map((p) => p.slug)).size, 68);
  for (const city of cities) {
    const state = states.find((state) => state.code === city.state);
    assert.ok(state);
    assert.ok(getCitiesForState(state.code).includes(city));
    assert.equal(getLocationBreadcrumbs(state, city).at(-2).href, `/locations/${state.slug}`);
    assert.ok(city.heading.includes(city.city));
    assert.ok(city.openingsHeading.includes(city.city));
    assert.ok(city.meta_title && city.meta_description);
  }
  assert.equal(getLocationBySlug("not-a-location"), undefined);
  assert.equal(getStateBySlug("not-a-state"), undefined);
});

test("location matching includes facility suffixes but excludes other cities/states and remote roles", () => {
  const city = getLocationBySlug("north-mankato-mn");
  for (const label of ["North Mankato, MN", "North Mankato, MN - Taylor", " North Mankato, Minnesota ", "MN-North Mankato-1825 Commerce Drive"]) {
    assert.equal(jobMatchesLocation({ locationsText: label }, city), true);
  }
  for (const label of ["Mankato, MN", "North Mankato, TX", "MN-Remote", "North Mankato, MN-Remote", ""]) {
    assert.equal(jobMatchesLocation({ locationsText: label }, city), false);
  }
  assert.equal(jobMatchesLocation({ locations: "North Mankato, MN" }, city), true);
  assert.equal(jobMatchesLocation({ locations: "MN-Remote; North Mankato, MN - Taylor" }, city), true);
  assert.equal(jobMatchesLocation({}, city), false);
  assert.equal(jobMatchesLocation({ locations: "Monroe Twp., NJ - Taylor" }, getLocationBySlug("monroe-township-nj")), true);
  assert.equal(jobMatchesLocation({ locations: "KY-Radcliff-2142 South Dixie Blvd" }, getLocationBySlug("radcliff-ky")), true);
});

test("View All city filter matches every facility and secondary location without broadening to other cities", () => {
  const city = getLocationBySlug("north-mankato-mn");
  const url = new URL(buildLocationSearchResultsPath(city), "https://example.com");
  assert.deepEqual(url.searchParams.getAll("tcb_location"), ["North Mankato, MN"]);
  const jobs = [
    { locationsText: "North Mankato, MN - Taylor", locations: "North Mankato, MN - Taylor" },
    { locationsText: "MN-North Mankato-1825 Commerce Drive", locations: "MN-North Mankato-1825 Commerce Drive" },
    { locationsText: "Bloomington, IL - Taylor, More...", locations: "Bloomington, IL - Taylor; North Mankato, MN - Navitor" },
    { locationsText: "Mankato, MN", locations: "Mankato, MN" },
  ];
  assert.deepEqual(jobs.map((job) => jobMatchesLocationFilter(job, "North Mankato, MN")), [true, true, true, false]);
  assert.equal(jobMatchesLocationFilter(jobs[0], "North Mankato, MN - Taylor"), true);
  assert.equal(jobMatchesLocationFilter(jobs[1], "North Mankato, MN - Taylor"), false);
});

test("photo catalog maps Taylor image URLs to their matching cities and supports multiple facilities", () => {
  const pages = getLocationPages();
  const images = pages.flatMap((page) => page.images);
  assert.equal(images.length, 67);
  assert.equal(pages.filter((page) => page.images.length).length, 46);
  assert.deepEqual(pages.filter((page) => !page.images.length).map((page) => page.slug), []);
  assert.equal(getLocationBySlug("north-mankato-mn").images.length, 11);
  assert.ok(getLocationBySlug("north-mankato-mn").images[0].src.endsWith("North-Mankato-MN-1725-Roe-Crest-Drive.webp"));
  assert.equal(getLocationBySlug("bloomington-il").images.length, 2);
  for (const page of pages) {
    for (const image of page.images) {
      const url = new URL(image.src);
      assert.equal(url.hostname, "www.taylor.com");
      assert.ok(url.pathname.includes("/Location%20Featured%20Image/") || url.pathname.includes("/dev/"));
      assert.ok(url.pathname.toLowerCase().includes(`/${page.slug}`));
      assert.ok(image.alt.includes(page.city));
    }
  }
  assert.ok(getLocationBySlug("minneapolis-mn").images.some((image) => image.src.includes("%20copy.webp")));
  assert.ok(getLocationBySlug("minneapolis-mn").images.some((image) => image.src.includes("%23100.webp")));
  assert.ok(getLocationBySlug("lakeland-fl").images[0].src.endsWith("Lakeland-FL.webp"));
  assert.ok(getLocationBySlug("radcliff-ky").images[0].src.endsWith("Radcliff-KY.webp"));
});

test("featured locations rank by live job counts and carousel reveals the next dot", () => {
  const jobs = [
    { locations: "North Mankato, MN - Taylor" },
    { locations: "North Mankato, MN - Navitor; Fridley, MN - Taylor" },
    { locations: "Fridley, MN - Taylor" },
    { locations: "Dallas, TX - Taylor" },
    { locations: "MN-Remote" },
  ];
  assert.deepEqual(getFeaturedLocations(jobs, 3).map(({ location, count }) => [location.slug, count]),
    [["fridley-mn", 2], ["north-mankato-mn", 2], ["dallas-tx", 1]]);
  assert.deepEqual(
    getCitiesWithJobCounts(jobs, "MN")
      .filter(({ count }) => count > 0)
      .map(({ slug, count }) => [slug, count]),
    [["fridley-mn", 2], ["north-mankato-mn", 2]],
  );
  assert.deepEqual(
    getStatesWithJobCounts(jobs)
      .filter(({ count }) => count > 0)
      .map(({ code, count }) => [code, count]),
    [["MN", 3], ["TX", 1]],
  );
  assert.deepEqual(getVisiblePhotoIndexes(11, 0), [0, 1, 2]);
  assert.deepEqual(getVisiblePhotoIndexes(11, 1), [1, 2, 3]);
  assert.deepEqual(getVisiblePhotoIndexes(11, 5), [5, 6, 7]);
  assert.deepEqual(getVisiblePhotoIndexes(11, 10), [8, 9, 10]);
  assert.deepEqual(getVisiblePhotoIndexes(2, 1), [0, 1]);
});
