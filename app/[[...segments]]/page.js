import { notFound } from "next/navigation";
import JobBoard from "@/app/components/JobBoard";
import {
  fetchJobs,
  getFiltersFromSearchParams,
  getListingPath,
  getListingUrl,
  getPageFromSegments,
  getStartIndexForPage,
  getTotalPages,
  getVisibleCountForPage,
  hasActiveFilters,
} from "@/app/lib/jobs";

function getMetaTitle(pageNumber) {
  return pageNumber > 1
    ? `Careers Page ${pageNumber} | Taylor`
    : "Careers | Taylor";
}

function getMetaDescription(pageNumber) {
  return pageNumber > 1
    ? `Explore open positions at Taylor, page ${pageNumber}.`
    : "Explore open positions at Taylor.";
}

function getPaginationLinks(pageNumber, totalPages) {
  return {
    prev:
      pageNumber > 1 ? getListingUrl(pageNumber - 1) : null,
    next:
      pageNumber < totalPages ? getListingUrl(pageNumber + 1) : null,
  };
}

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const pageNumber = getPageFromSegments(resolvedParams?.segments);

  if (pageNumber === null) {
    return { title: "Page Not Found | Taylor" };
  }

  const jobs = await fetchJobs();
  const totalPages = getTotalPages(jobs.length);

  if (pageNumber > totalPages) {
    return { title: "Page Not Found | Taylor" };
  }

  const filters = getFiltersFromSearchParams(resolvedSearchParams);
  const canonicalPagePath = getListingPath(pageNumber);
  const pagination = getPaginationLinks(pageNumber, totalPages);

  return {
    title: getMetaTitle(pageNumber),
    description: getMetaDescription(pageNumber),
    alternates: {
      canonical: canonicalPagePath,
    },
    pagination: {
      previous: pagination.prev || undefined,
      next: pagination.next || undefined,
    },
    other: {
      "filters:active": hasActiveFilters(filters) ? "true" : "false",
    },
  };
}

export default async function ListingPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const pageNumber = getPageFromSegments(resolvedParams?.segments);

  if (pageNumber === null) {
    notFound();
  }

  const jobs = await fetchJobs();
  const totalPages = getTotalPages(jobs.length);

  if (pageNumber > totalPages) {
    notFound();
  }

  const initialFilters = getFiltersFromSearchParams(resolvedSearchParams);
  const initialVisibleCount = getVisibleCountForPage(pageNumber, jobs.length);
  const initialStartIndex = getStartIndexForPage(pageNumber);

  return (
    <JobBoard
      initialJobs={jobs}
      initialFilters={initialFilters}
      initialVisibleCount={initialVisibleCount}
      initialStartIndex={initialStartIndex}
    />
  );
}
