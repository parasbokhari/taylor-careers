import { notFound } from "next/navigation";
import Link from "next/link";
import JobBoard from "@/app/components/JobBoard";
import { getCategoryPageContent } from "@/app/lib/categoryContent";
import {
  EMPTY_FILTERS,
  buildCategoryPath,
  fetchJobs,
  getCategoryBySlug,
} from "@/app/lib/jobs";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const jobs = await fetchJobs();
  const category = getCategoryBySlug(jobs, slug);

  if (!category) {
    return { title: "Category Not Found | Taylor" };
  }

  return {
    title: `${category} Jobs | Taylor Careers`,
    description: `Explore ${category} jobs at Taylor.`,
    alternates: {
      canonical: buildCategoryPath(category),
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const jobs = await fetchJobs();
  const category = getCategoryBySlug(jobs, slug);

  if (!category) notFound();

  const categoryJobs = jobs.filter((job) => job.jobFamilyGroup === category);
  if (categoryJobs.length === 0) notFound();

  const categoryFilter = {
    ...EMPTY_FILTERS,
    category: [category],
  };
  const categoryContent = getCategoryPageContent(category);

  return (
    <>
      <section className="c__category-hero">
        <div className="container">
          <Link href="/categories" className="c__category-hero__back-link">
            Back
          </Link>
          <h1 className="c__category-hero__title">
            {categoryContent.heading}
          </h1>
          {categoryContent.description && (
            <p className="c__category-hero__description">
              {categoryContent.description}
            </p>
          )}
        </div>
      </section>
      <JobBoard
        initialJobs={jobs}
        initialFilters={categoryFilter}
        showInitialFilterLoading={false}
        urlFilterDefaults={categoryFilter}
      />
    </>
  );
}
