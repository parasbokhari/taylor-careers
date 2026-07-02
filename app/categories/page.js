import Breadcrumbs from "@/app/components/Breadcrumbs";
import CategoryBadge from "@/app/components/CategoryBadge";
import { getBreadcrumbsForPath } from "@/app/lib/breadcrumbs";
import { getCategoryPages } from "@/app/lib/categoryContent";
import { buildSeoMetadata } from "@/app/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Job Categories | Taylor Careers",
  description: "Browse Taylor careers by job category.",
  path: "/categories",
});

export default function CategoriesPage() {
  const categories = getCategoryPages();

  return (
    <>
      <Breadcrumbs items={getBreadcrumbsForPath("/categories")} />
      <section className="b__size-md b__u-careers__category-list">
        <div className="container">
          <div className="c__heading-wrapper mb-4 text-center">
            <h1 className="c__heading u__h2 u__f-700 d-block u__heading-color--primary mb-0">
              Browse Jobs by Category
            </h1>
          </div>
        </div>
        <div className="container mt-4 pt-4">
          <div className="b__u-careers__category-list__content-wrapper">
            <div className="b__u-careers__category-list__grid">
              {categories.map((category) => (
                <CategoryBadge
                  category={category}
                  headingTag="h2"
                  href={`/categories/${category.slug}`}
                  key={category.slug}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
