import categoryPages from "@/app/data/categoryPages.json";
import { URL_KEYS } from "@/app/lib/jobs";

export function getCategoryPages() {
  return categoryPages;
}

export function getCategoryPageBySlug(slug = "") {
  const requestedSlug = Array.isArray(slug) ? slug[0] : slug;
  return categoryPages.find((page) => page.slug === requestedSlug) ?? null;
}

export function getCategoryPageByCategory(category = "") {
  return categoryPages.find((page) => page.category === category) ?? null;
}

function getCategoryPageByRelatedName(name = "") {
  return (
    categoryPages.find((page) => {
      return (
        page.category === name ||
        page.slug === name ||
        page.workday_internal_names?.includes(name)
      );
    }) ?? null
  );
}

export function getCategoryPageParams() {
  return categoryPages.map((page) => ({ slug: page.slug }));
}

export function getCategoryWorkdayNames(categoryPage) {
  return categoryPage?.workday_internal_names?.length
    ? categoryPage.workday_internal_names
    : [categoryPage.category];
}

export function buildCategorySearchResultsPath(categoryPage) {
  const params = new URLSearchParams();

  getCategoryWorkdayNames(categoryPage).forEach((category) => {
    params.append(URL_KEYS.category, category);
  });

  const query = params.toString();
  return query ? `/search-results?${query}` : "/search-results";
}

function getDeterministicScore(seed, value) {
  return `${seed}:${value}`.split("").reduce((score, char) => {
    return (score * 31 + char.charCodeAt(0)) % 1000003;
  }, 7);
}

export function getRelatedCategoryPages(slug = "", count = 4) {
  const categoryPage = getCategoryPageBySlug(slug);
  const specifiedRelatedCategories =
    categoryPage?.similar_categories
      ?.map((name) => getCategoryPageByRelatedName(name))
      .filter(Boolean)
      .filter((page) => page.slug !== slug) ?? [];

  if (specifiedRelatedCategories.length > 0) {
    return specifiedRelatedCategories.slice(0, count);
  }

  return categoryPages
    .filter((page) => page.slug !== slug)
    .map((page) => ({
      page,
      score: getDeterministicScore(slug, page.slug),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(({ page }) => page);
}
