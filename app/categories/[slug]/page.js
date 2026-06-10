import { notFound } from "next/navigation";
import Link from "next/link";
import CategoryBadge from "@/app/components/CategoryBadge";
import FaqAccordion from "@/app/components/FaqAccordion";
import JobCard from "@/app/components/JobCard";
import {
  buildCategorySearchResultsPath,
  getCategoryPageBySlug,
  getCategoryPageParams,
  getRelatedCategoryPages,
  getCategoryWorkdayNames,
} from "@/app/lib/categoryContent";
import { fetchJobs, sortJobsByNewest } from "@/app/lib/jobs";
import { buildSeoMetadata } from "@/app/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategoryPageParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryPage = getCategoryPageBySlug(slug);

  if (!categoryPage) {
    return buildSeoMetadata({
      title: "Category Not Found | Taylor",
      description: "The requested Taylor Careers category could not be found.",
      path: "/categories",
      robots: { index: false, follow: false },
    });
  }

  const title =
    categoryPage.meta_title || `${categoryPage.category} Jobs | Taylor Careers`;
  const description =
    categoryPage.meta_description ||
    categoryPage.description ||
    `Explore ${categoryPage.category} jobs at Taylor.`;

  return buildSeoMetadata({
    title,
    description,
    path: `/categories/${categoryPage.slug}`,
    image: categoryPage.featured_image || undefined,
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const categoryPage = getCategoryPageBySlug(slug);
  if (!categoryPage) notFound();

  const jobs = await fetchJobs();
  const categoryWorkdayNames = getCategoryWorkdayNames(categoryPage);
  const categoryJobs = sortJobsByNewest(
    jobs.filter((job) => categoryWorkdayNames.includes(job.jobFamilyGroup)),
  );
  const featuredJobs = categoryJobs.slice(0, 4);
  const relatedCategories = getRelatedCategoryPages(categoryPage.slug, 4);
  const searchResultsPath = buildCategorySearchResultsPath(categoryPage);

  return (
    <>
      <section className="b__size-md b__u-careers__category-hero">
        <div className="container">
          <div className="b__u-careers__category-hero__content-wrapper">
            <div className="row b__u-careers__category-hero__grid-row">
              <div className="col-lg-6">
                <div className="c__icon-wrapper mb-4">
                  <figure className="m-0 d-inline">
                    {categoryPage.icon_badge ? (
                      <img
                        src={categoryPage.icon_badge}
                        alt=""
                        loading="lazy"
                      />
                    ) : null}
                  </figure>
                </div>
                <div className="c__heading-wrapper mb-4">
                  <h1 className="c__heading u__h2 u__f-700 d-block u__heading-color--primary mb-0">
                    {categoryPage.heading}
                  </h1>
                </div>
                {categoryPage.description ? (
                  <div className="c__description-wrapper">
                    <p className="mb-0 u__h6">{categoryPage.description}</p>
                  </div>
                ) : null}
                <div className="c__button-wrapper mt-4">
                  <Link
                    className="c__button__anchor-element"
                    href={searchResultsPath}
                  >
                    <span className="c__button c__button--primary c__button--size-xlarge c__button--type-squarish u__f-700">
                      <div className="c__button__content u__f-700">
                        <span>View All Open Jobs</span>
                      </div>
                    </span>
                  </Link>
                </div>
              </div>
              {categoryPage.featured_image ? (
                <div className="col-lg-6">
                  <div className="c__image-wrapper">
                    <figure className="m-0 d-inline">
                      <img
                        src={categoryPage.featured_image}
                        alt=""
                        loading="lazy"
                      />
                    </figure>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <section className="b__size-md b__u-careers__category-openings">
        <div className="container">
          <div className="c__heading-wrapper mb-4 text-center">
            <h2 className="c__heading u__h3 u__f-700 d-block u__heading-color--primary mb-0">
              Open {categoryPage.category} Jobs{" "}
              <span className="u__f-400">({categoryJobs.length})</span>
            </h2>
          </div>
        </div>
        <div className="container mt-4 pt-4">
          <div className="b__u-careers__category-openings__jobs-list">
            {featuredJobs.length > 0 ? (
              <>
                {featuredJobs.map((job) => (
                  <JobCard job={job} key={job.jobRequisitionId} />
                ))}
              </>
            ) : (
              <div className="c__description-wrapper text-center">
                <p className="mb-0 u__p">
                  There are no open roles in this category right now.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="container mt-4 pt-4">
          <div className="c__button-wrapper mt-0 text-center">
            <Link
              className="c__button__anchor-element"
              href={searchResultsPath}
            >
              <span className="c__button c__button--primary c__button--size-xlarge c__button--type-squarish u__f-700">
                <div className="c__button__content u__f-700">
                  <span>View All</span>
                </div>
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="b__size-md b__u-careers__related-categories pt-2">
        <div className="container">
          <div className="c__heading-wrapper mb-4 text-center">
            <h2 className="c__heading u__h3 u__f-700 d-block u__heading-color--primary mb-0">
              Similar Job Categories
            </h2>
          </div>
        </div>
        <div className="container mt-4 pt-4">
          <div className="b__u-careers__related-categories__grid">
            {relatedCategories.map((category) => (
              <CategoryBadge
                category={category}
                href={`/categories/${category.slug}`}
                key={category.slug}
              />
            ))}
          </div>
        </div>
      </section>
      {categoryPage.faqs.length > 0 ? (
        <section className="b__size-md b__faq__faqs-with-content u__remove-padding-top-till-md">
          <div className="container">
            <div className="b__faq__faqs-with-content__content-wrapper text-center">
              <div className="c__heading-wrapper mb-4">
                <h2 className="u__h2 c__heading">Frequently Asked Questions</h2>
              </div>
            </div>
          </div>
          <div className="container mt-4 pt-4">
            <div className="mx-auto" style={{ maxWidth: "800px" }}>
              <FaqAccordion
                faqs={categoryPage.faqs}
                moduleId={`category-${categoryPage.slug}-faqs`}
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
