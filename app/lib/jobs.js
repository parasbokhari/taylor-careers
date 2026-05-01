import { cache } from "react";

const API_URL = "https://taylor-workday-jobs.vercel.app/api/workday";
const WORKDAY_BASE = "https://taylor.wd1.myworkdayjobs.com/en-US/External";
const JOBS_PER_PAGE = 20;
const LAST_BOARD_URL_STORAGE_KEY = "taylor-careers:last-board-url";
const DEFAULT_SITE_URL = "https://careers.taylor.com";
const URL_KEYS = {
  category: "tcb_category",
  state: "tcb_state",
  jobType: "tcb_job_type",
  location: "tcb_location",
  status: "tcb_status",
  search: "tcb_search",
  sort: "tcb_sort",
};
const EMPTY_FILTERS = {
  category: [],
  state: [],
  jobType: [],
  location: [],
  status: [],
  search: "",
  sort: "newest",
};

export const fetchJobs = cache(async function fetchJobs() {
  const res = await fetch(API_URL, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  const data = await res.json();
  return Array.isArray(data) ? data : data.jobs ?? [];
});

export function getFirstBatch(jobs) {
  return jobs.slice(0, JOBS_PER_PAGE);
}

export function getJobById(jobs, id) {
  return jobs.find((j) => j.jobRequisitionId === id) ?? null;
}

export function getJobIdFromSlug(slug = "") {
  const cleaned = Array.isArray(slug) ? slug[0] : slug;
  const match = cleaned.match(/([a-z]\d+)$/i);
  return match ? match[1].toUpperCase() : cleaned.toUpperCase();
}

export function getJobBySlug(jobs, slug) {
  return getJobById(jobs, getJobIdFromSlug(slug));
}

export function buildWorkdayUrl(externalPath) {
  if (!externalPath) return null;
  return `${WORKDAY_BASE}${externalPath}`;
}

export function stripHtml(html = "") {
  return html
    .replace(/<(p|div|li|br|h[1-6])[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptDescription(html, maxChars = 160) {
  const text = stripHtml(html);
  return text.length > maxChars ? text.slice(0, maxChars).trimEnd() + "…" : text;
}

export function parseLocation(job) {
  const raw = job.locationsText || job.locations || "";
  // Strip trailing " - Company Name" suffix
  return raw.split(" - ")[0].trim();
}

export function slugifyJobTitle(title = "") {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildJobPath(job) {
  if (!job?.jobRequisitionId) return null;
  const titleSlug = slugifyJobTitle(job.title || "job");
  return `/jobs/${titleSlug}-${job.jobRequisitionId.toLowerCase()}`;
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    DEFAULT_SITE_URL
  ).replace(/\/+$/, "");
}

export function getListingPath(pageNumber = 1) {
  return pageNumber > 1 ? `/page/${pageNumber}` : "/";
}

export function getListingUrl(pageNumber = 1) {
  return `${getSiteUrl()}${getListingPath(pageNumber)}`;
}

export function getTotalPages(totalJobs = 0) {
  return Math.max(1, Math.ceil(totalJobs / JOBS_PER_PAGE));
}

export function getVisibleCountForPage(pageNumber = 1, totalJobs = 0) {
  return Math.min(Math.max(pageNumber, 1) * JOBS_PER_PAGE, totalJobs);
}

export function getStartIndexForPage(pageNumber = 1) {
  return Math.max(pageNumber - 1, 0) * JOBS_PER_PAGE;
}

export function getPageFromSegments(segments) {
  if (!segments || segments.length === 0) return 1;
  if (segments.length === 2 && segments[0] === "page") {
    const pageNumber = Number.parseInt(segments[1], 10);
    return Number.isFinite(pageNumber) && pageNumber > 1 ? pageNumber : null;
  }
  return null;
}

function getAllValues(searchParams, key) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value) return [value];
  return [];
}

export function getFiltersFromSearchParams(searchParams) {
  if (!searchParams) return EMPTY_FILTERS;
  const search = searchParams?.[URL_KEYS.search];
  const sort = searchParams?.[URL_KEYS.sort];

  return {
    category: getAllValues(searchParams, URL_KEYS.category),
    state: getAllValues(searchParams, URL_KEYS.state),
    jobType: getAllValues(searchParams, URL_KEYS.jobType),
    location: getAllValues(searchParams, URL_KEYS.location),
    status: getAllValues(searchParams, URL_KEYS.status),
    search: typeof search === "string" ? search : "",
    sort: typeof sort === "string" && sort ? sort : "newest",
  };
}

export function hasActiveFilters(filters = EMPTY_FILTERS) {
  return Boolean(
    filters.category.length ||
      filters.state.length ||
      filters.jobType.length ||
      filters.location.length ||
      filters.status.length ||
      filters.search ||
      filters.sort !== "newest",
  );
}

export {
  EMPTY_FILTERS,
  JOBS_PER_PAGE,
  LAST_BOARD_URL_STORAGE_KEY,
  URL_KEYS,
};
