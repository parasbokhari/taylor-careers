export const BREADCRUMB_ROUTE_LABELS = {
  "/": "Careers",
  "/categories": "Browse Jobs by Categories",
  "/search-results": "Search Results",
};

function normalizePath(path = "") {
  if (!path || path === "/") return "/";
  return `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "");
}

export function getBreadcrumbsForPath(path) {
  const normalizedPath = normalizePath(path);
  const label = BREADCRUMB_ROUTE_LABELS[normalizedPath];

  if (!label) return [];

  if (normalizedPath === "/") {
    return [{ label }];
  }

  return [
    {
      label: BREADCRUMB_ROUTE_LABELS["/"],
      href: "/",
    },
    { label },
  ];
}

export function getCategoryPageBreadcrumbs(categoryPage) {
  return [
    {
      label: BREADCRUMB_ROUTE_LABELS["/"],
      href: "/",
    },
    {
      label: BREADCRUMB_ROUTE_LABELS["/categories"],
      href: "/categories",
    },
    {
      label: categoryPage.heading || categoryPage.category,
    },
  ];
}
