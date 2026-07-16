import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import JobBoard from "@/app/components/JobBoard";
import { JobBoardLoadingSkeleton } from "@/app/components/LoadingSkeletons";
import { getBreadcrumbsForPath } from "@/app/lib/breadcrumbs";
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
import { buildSeoMetadata } from "@/app/lib/seo";

const SEARCH_META_TITLE =
  "Explore Open Positions with Taylor | Search Job Openings";
const SEARCH_META_DESCRIPTION =
  "Find openings in manufacturing and production, technology, sales, engineering, human resources, supply chain and logistics, marketing and creative, and more.";

function getMetaTitle(pageNumber) {
  return pageNumber > 1
    ? `${SEARCH_META_TITLE} | Page ${pageNumber}`
    : SEARCH_META_TITLE;
}

function getMetaDescription() {
  return SEARCH_META_DESCRIPTION;
}

function getPaginationLinks(pageNumber, totalPages) {
  return {
    prev: pageNumber > 1 ? getListingUrl(pageNumber - 1) : null,
    next: pageNumber < totalPages ? getListingUrl(pageNumber + 1) : null,
  };
}

function shouldLoadSkeleton(searchParams) {
  return searchParams?.load_skeleton === "true";
}

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const pageNumber = getPageFromSegments(resolvedParams?.segments);

  if (pageNumber === null) {
    return buildSeoMetadata({
      title: "Page Not Found | Taylor",
      description: "The requested Taylor Careers page could not be found.",
      path: "/search-results",
      robots: { index: false, follow: false },
    });
  }

  const jobs = await fetchJobs();
  const totalPages = getTotalPages(jobs.length);

  if (pageNumber > totalPages) {
    return buildSeoMetadata({
      title: "Page Not Found | Taylor",
      description: "The requested Taylor Careers page could not be found.",
      path: "/search-results",
      robots: { index: false, follow: false },
    });
  }

  const filters = getFiltersFromSearchParams(resolvedSearchParams);
  const canonicalPagePath = getListingPath(pageNumber);
  const pagination = getPaginationLinks(pageNumber, totalPages);
  const hasFilters = hasActiveFilters(filters);

  return {
    ...buildSeoMetadata({
      title: getMetaTitle(pageNumber),
      description: getMetaDescription(),
      path: canonicalPagePath,
    }),
    title: getMetaTitle(pageNumber),
    description: getMetaDescription(),
    pagination: {
      previous: pagination.prev || undefined,
      next: pagination.next || undefined,
    },
    other: {
      "filters:active": hasFilters ? "true" : "false",
    },
  };
}

export default async function ListingPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  if (shouldLoadSkeleton(resolvedSearchParams)) {
    return <JobBoardLoadingSkeleton />;
  }

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
    <>
      <Breadcrumbs items={getBreadcrumbsForPath("/search-results")} />
      <JobBoard
        initialJobs={jobs}
        initialFilters={initialFilters}
        initialVisibleCount={initialVisibleCount}
        initialStartIndex={initialStartIndex}
      />
    </>
  );
}
