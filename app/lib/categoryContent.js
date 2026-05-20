import { slugifyCategory } from "@/app/lib/jobs";

const DEFAULT_CATEGORY_PAGE_CONTENT = {
  heading: null,
  description: null,
};

const CATEGORY_PAGE_CONTENT = {
  internship: {
    heading: "Internships at Taylor",
  },
};

export function getCategoryPageContent(category) {
  const customContent = CATEGORY_PAGE_CONTENT[slugifyCategory(category)] || {};

  return {
    ...DEFAULT_CATEGORY_PAGE_CONTENT,
    heading: `${category} Careers at Taylor`,
    ...customContent,
  };
}
