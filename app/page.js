import Link from "next/link";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import CategoryBadge from "@/app/components/CategoryBadge";
import JobCard from "@/app/components/JobCard";
import { getHomePageBreadcrumbs } from "@/app/lib/breadcrumbs";
import { getCategoryPages } from "@/app/lib/categoryContent";
import { fetchJobs, sortJobsByNewest } from "@/app/lib/jobs";
import { buildSeoMetadata } from "@/app/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Taylor Careers",
  description: "Explore careers at Taylor.",
  path: "/",
});

function isSpotlightJob(job) {
  const value = job.Spotlight_Job ?? job.spotlight_job ?? job.spotlightJob;
  return value === true || String(value).trim() === "1";
}

function getFeaturedJobs(jobs) {
  const newestJobs = sortJobsByNewest(jobs);
  const spotlightJobs = newestJobs.filter(isSpotlightJob);

  return (spotlightJobs.length >= 2 ? spotlightJobs : newestJobs).slice(0, 4);
}

export default async function HomePage() {
  const categories = getCategoryPages();
  const jobs = await fetchJobs();
  const featuredJobs = getFeaturedJobs(jobs);

  return (
    <>
      {/* <Breadcrumbs items={getHomePageBreadcrumbs()} /> */}
      <section className="b__size-md b__u-careers__index-hero">
        <div className="container">
          <div className="b__u-careers__index-hero__content-wrapper">
            <div className="c__heading-wrapper mb-3 text-center">
              <h1 className="c__heading u__h1 u__f-700 d-block u__heading-color--primary mb-0">
                Browse Jobs
              </h1>
            </div>
            <div className="c__description-wrapper text-center">
              <p className="mb-0 u__h6">
                Taylor offers a wide range of career opportunities across
                manufacturing, printing, sales, and corporate functions. With
                locations across the United States, open roles range from
                hands-on production positions to technology and business roles
                supporting our operations.
              </p>
            </div>
          </div>
          <div className="b__u-careers__index-hero__media-wrapper mt-5 pt-4">
            <div className="b__u-careers__index-hero__search-card">
              <form
                action="/search-results"
                className="c__job-board-embed__search-form b__u-careers__index-hero__search-form"
                id="homepage-job-search-form"
              >
                <div className="c__job-board-embed__search-form__input-wrapper">
                  <div className="c__job-board-embed__search-form__figure-wrapper">
                    <figure className="m-0 d-inline" />
                  </div>
                  <input
                    aria-label="Job Title, Skill or Keyword"
                    autoComplete="off"
                    className="c__job-board-embed__search-form__input"
                    id="homepage-job-search"
                    name="tcb_search"
                    placeholder="Job Title, Skill or Keyword"
                    type="text"
                  />
                </div>
              </form>
              <div className="b__u-careers__index-hero__search-actions">
                <span className="c__job-board-embed__search-form__button-wrapper">
                  <button
                    className="c__job-board-embed__search-form__button c__button c__button--primary c__button--rounded u__f-700"
                    form="homepage-job-search-form"
                    type="submit"
                  >
                    <div className="c__button__content u__f-700">
                      <span>Search Jobs</span>
                    </div>
                  </button>
                </span>
                <Link
                  className="c__button__anchor-element"
                  href="/search-results"
                >
                  <span className="c__button c__button--ghost c__button--ghost--bg-blue-25 c__button--rounded u__f-700">
                    <div className="c__button__content u__f-700">
                      <span>Browse All Jobs</span>
                    </div>
                  </span>
                </Link>
              </div>
            </div>
            <div
              className="b__u-careers__index-hero__image-placeholder"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="b__size-md b__u-careers__category-list">
        <div className="container">
          <div className="c__heading-wrapper mb-4 text-center">
            <h2 className="c__heading u__h3 u__f-700 d-block u__heading-color--primary mb-0">
              Browse Job by Categories
            </h2>
          </div>
        </div>
        <div className="container mt-4 pt-4">
          <div className="b__u-careers__category-list__content-wrapper">
            <div className="b__u-careers__category-list__grid">
              {categories.map((category) => (
                <CategoryBadge
                  category={category}
                  href={`/categories/${category.slug}`}
                  key={category.slug}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="b__size-md b__u-careers__index-featured-jobs">
        <div className="container">
          <div className="c__heading-wrapper mb-4 text-center">
            <h2 className="c__heading u__h3 u__f-700 d-block u__heading-color--primary mb-0">
              Featured Jobs
            </h2>
          </div>
        </div>
        <div className="container mt-4 pt-4">
          <div className="b__u-careers__index-featured-jobs__jobs-list">
            {featuredJobs.map((job) => (
              <JobCard job={job} key={job.jobRequisitionId} />
            ))}
          </div>
        </div>
        <div className="container mt-4 pt-4">
          <div className="c__button-wrapper mt-0 text-center">
            <Link className="c__button__anchor-element" href="/search-results">
              <span className="c__button c__button--primary c__button--size-xlarge c__button--type-squarish u__f-700">
                <div className="c__button__content u__f-700">
                  <span>Browse Open Jobs</span>
                </div>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
