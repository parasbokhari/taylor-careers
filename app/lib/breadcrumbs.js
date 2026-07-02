export const BREADCRUMB_ROUTE_LABELS = {
  "/": "Browse Taylor Jobs",
  "/categories": "Browse Jobs by Category",
  "/search-results": "Search Results",
};

const CAREERS_CRUMB = {
  label: "Careers",
  href: "https://www.taylor.com/careers",
};

function getBrowseJobsCrumb(isCurrent = false) {
  return {
    label: BREADCRUMB_ROUTE_LABELS["/"],
    ...(isCurrent ? {} : { href: "/" }),
  };
}

function normalizePath(path = "") {
  if (!path || path === "/") return "/";
  return `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "");
}

export function getBreadcrumbsForPath(path) {
  const normalizedPath = normalizePath(path);
  const label = BREADCRUMB_ROUTE_LABELS[normalizedPath];

  if (!label) return [];

  return [
    CAREERS_CRUMB,
    getBrowseJobsCrumb(normalizedPath === "/"),
    ...(normalizedPath === "/" ? [] : [{ label }]),
  ];
}

export function getJobPageBreadcrumbs(job) {
  return [
    CAREERS_CRUMB,
    getBrowseJobsCrumb(),
    {
      label: BREADCRUMB_ROUTE_LABELS["/search-results"],
      href: "/search-results",
    },
    {
      label: job?.title || "Job Detail",
    },
  ];
}

export function getCategoryPageBreadcrumbs(categoryPage) {
  return [
    CAREERS_CRUMB,
    getBrowseJobsCrumb(),
    {
      label: BREADCRUMB_ROUTE_LABELS["/categories"],
      href: "/categories",
    },
    {
      label: categoryPage.category,
    },
  ];
}

export function getHomePageBreadcrumbs() {
  return getBreadcrumbsForPath("/");
}
