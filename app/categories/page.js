import Link from "next/link";
import {
  buildCategoryPath,
  fetchJobs,
  getJobCategories,
} from "@/app/lib/jobs";

export const metadata = {
  title: "Job Categories | Taylor Careers",
  description: "Browse Taylor careers by job category.",
  alternates: {
    canonical: "/categories",
  },
};

export default async function CategoriesPage() {
  const jobs = await fetchJobs();
  const categories = getJobCategories(jobs);

  return (
    <section className="c__categories-index">
      <div className="container">
        <div className="c__categories-index__header">
          <h1 className="c__heading u__h3 u__f-700 d-block u__heading-color--primary mb-0">
            Job Categories
          </h1>
        </div>
        <div className="c__categories-index__grid">
          {categories.map((category) => {
            const path = buildCategoryPath(category);
            if (!path) return null;

            return (
              <Link
                className="c__categories-index__link"
                href={path}
                key={category}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
