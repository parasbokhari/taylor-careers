import Image from "next/image";
import Link from "@/app/components/CustomLink";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import CategoryBadge from "@/app/components/CategoryBadge";
import JobCard from "@/app/components/JobCard";
import { getHomePageBreadcrumbs } from "@/app/lib/breadcrumbs";
import { getCategoryPages } from "@/app/lib/categoryContent";
import { fetchJobs, sortJobsByNewest } from "@/app/lib/jobs";
import { buildSeoMetadata } from "@/app/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Search Jobs at Taylor | Open Jobs with Taylor | Taylor",
  description:
    "Search Taylor careers for opportunities in print operations, customer service, IT, HR, finance, marketing and more. Explore benefits and career paths today.",
  path: "/",
});

const IMAGE_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwMCcgaGVpZ2h0PSc4MDAnIHZpZXdCb3g9JzAgMCAxMjAwIDgwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgxPScwJyB5MT0nMCcgeDI9JzEnIHkyPScxJz48c3RvcCBzdG9wLWNvbG9yPScjZTVlZmZmJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjZmZmZmZmJy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9JzEyMDAnIGhlaWdodD0nODAwJyBmaWxsPSd1cmwoI2cpJy8+PC9zdmc+";

const INDEX_OUTRO_CARDS = [
  {
    title: "Physical Health & Plan Coverage",
    description:
      "Comprehensive medical, dental and vision coverage starting immediately.",
    icon: (
      <svg
        width={56}
        height={56}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x={4} y={4} width={48} height={48} rx={24} fill="#6816E2" />
        <rect
          x={4}
          y={4}
          width={48}
          height={48}
          rx={24}
          stroke="#EFE9FF"
          strokeWidth={8}
        />
        <path
          d="M31 20.6C31 20.0399 31 19.7599 30.891 19.546C30.7951 19.3578 30.6422 19.2049 30.454 19.109C30.2401 19 29.9601 19 29.4 19H26.6C26.0399 19 25.7599 19 25.546 19.109C25.3578 19.2049 25.2049 19.3578 25.109 19.546C25 19.7599 25 20.0399 25 20.6V23.4C25 23.9601 25 24.2401 24.891 24.454C24.7951 24.6422 24.6422 24.7951 24.454 24.891C24.2401 25 23.9601 25 23.4 25H20.6C20.0399 25 19.7599 25 19.546 25.109C19.3578 25.2049 19.2049 25.3578 19.109 25.546C19 25.7599 19 26.0399 19 26.6V29.4C19 29.9601 19 30.2401 19.109 30.454C19.2049 30.6422 19.3578 30.7951 19.546 30.891C19.7599 31 20.0399 31 20.6 31H23.4C23.9601 31 24.2401 31 24.454 31.109C24.6422 31.2049 24.7951 31.3578 24.891 31.546C25 31.7599 25 32.0399 25 32.6V35.4C25 35.9601 25 36.2401 25.109 36.454C25.2049 36.6422 25.3578 36.7951 25.546 36.891C25.7599 37 26.0399 37 26.6 37H29.4C29.9601 37 30.2401 37 30.454 36.891C30.6422 36.7951 30.7951 36.6422 30.891 36.454C31 36.2401 31 35.9601 31 35.4V32.6C31 32.0399 31 31.7599 31.109 31.546C31.2049 31.3578 31.3578 31.2049 31.546 31.109C31.7599 31 32.0399 31 32.6 31H35.4C35.9601 31 36.2401 31 36.454 30.891C36.6422 30.7951 36.7951 30.6422 36.891 30.454C37 30.2401 37 29.9601 37 29.4V26.6C37 26.0399 37 25.7599 36.891 25.546C36.7951 25.3578 36.6422 25.2049 36.454 25.109C36.2401 25 35.9601 25 35.4 25L32.6 25C32.0399 25 31.7599 25 31.546 24.891C31.3578 24.7951 31.2049 24.6422 31.109 24.454C31 24.2401 31 23.9601 31 23.4V20.6Z"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Investing in Your Future",
    description: "Build a strong financial future with confidence.",
    icon: (
      <svg
        width={56}
        height={56}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x={4} y={4} width={48} height={48} rx={24} fill="#2458F1" />
        <rect
          x={4}
          y={4}
          width={48}
          height={48}
          rx={24}
          stroke="#E9EFFF"
          strokeWidth={8}
        />
        <path
          d="M22 27V31M34 25V29M33 20C35.4487 20 36.7731 20.3748 37.4321 20.6654C37.5199 20.7042 37.5638 20.7235 37.6904 20.8444C37.7663 20.9168 37.9049 21.1294 37.9405 21.2281C38 21.3927 38 21.4827 38 21.6627V32.4111C38 33.3199 38 33.7743 37.8637 34.0079C37.7251 34.2454 37.5914 34.3559 37.3319 34.4472C37.0769 34.5369 36.562 34.438 35.5322 34.2401C34.8114 34.1017 33.9565 34 33 34C30 34 27 36 23 36C20.5513 36 19.2269 35.6252 18.5679 35.3346C18.4801 35.2958 18.4362 35.2765 18.3096 35.1556C18.2337 35.0832 18.0951 34.8706 18.0595 34.7719C18 34.6073 18 34.5173 18 34.3373L18 23.5889C18 22.6801 18 22.2257 18.1363 21.9921C18.2749 21.7546 18.4086 21.6441 18.6681 21.5528C18.9231 21.4631 19.438 21.562 20.4678 21.7598C21.1886 21.8983 22.0435 22 23 22C26 22 29 20 33 20ZM30.5 28C30.5 29.3807 29.3807 30.5 28 30.5C26.6193 30.5 25.5 29.3807 25.5 28C25.5 26.6193 26.6193 25.5 28 25.5C29.3807 25.5 30.5 26.6193 30.5 28Z"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Wellness & Preventative Care",
    description: "Personalized tools to support your total health.",
    icon: (
      <svg
        width={56}
        height={56}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x={4} y={4} width={48} height={48} rx={24} fill="#00A398" />
        <rect
          x={4}
          y={4}
          width={48}
          height={48}
          rx={24}
          stroke="#C8EFEC"
          strokeWidth={8}
        />
        <path
          d="M25 27L27 29L31.5 24.5M27.9932 21.1358C25.9938 18.7984 22.6597 18.1696 20.1547 20.31C17.6496 22.4504 17.297 26.029 19.2642 28.5604C20.7501 30.4724 24.9713 34.311 26.948 36.0749C27.3114 36.3991 27.4931 36.5613 27.7058 36.6251C27.8905 36.6805 28.0958 36.6805 28.2805 36.6251C28.4932 36.5613 28.6749 36.3991 29.0383 36.0749C31.015 34.311 35.2362 30.4724 36.7221 28.5604C38.6893 26.029 38.3797 22.4279 35.8316 20.31C33.2835 18.1922 29.9925 18.7984 27.9932 21.1358Z"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

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
                Browse Taylor Jobs
              </h1>
            </div>
            <div className="c__description-wrapper text-center">
              <p className="mb-0 u__h6">
                Taylor offers a wide range of opportunities designed to match
                different skills, goals and career stages. You can explore open
                positions, learn more about each department and find jobs near
                you that offer competitive pay, strong benefits and real
                opportunities for advancement.
              </p>
            </div>
          </div>
          <div className="b__u-careers__index-hero__media-wrapper mt-4 pt-2 pt-md-4">
            <div className="b__u-careers__index-hero__search-card">
              <form
                action="/search-results"
                className="c__job-board-embed__search-form b__u-careers__index-hero__search-form"
                id="homepage-job-search-form"
              >
                <div className="c__job-board-embed__search-form__input-wrapper">
                  <div className="c__job-board-embed__search-form__figure-wrapper">
                    <figure className="m-0 d-inline">
                      <svg
                        width={22}
                        height={22}
                        viewBox="0 0 23 23"
                        fill="none"
                      >
                        <path
                          d="M19.6 19.6L15.54 15.54M17.7334 10.2667C17.7334 14.3904 14.3904 17.7333 10.2667 17.7333C6.14299 17.7333 2.80005 14.3904 2.80005 10.2667C2.80005 6.14294 6.14299 2.8 10.2667 2.8C14.3904 2.8 17.7334 6.14294 17.7334 10.2667Z"
                          stroke="#25282A"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </figure>
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
                    className="c__job-board-embed__search-form__button c__button c__button--with-icon c__button--primary c__button--rounded u__f-700 d-flex justify-content-center"
                    form="homepage-job-search-form"
                    type="submit"
                  >
                    <div className="c__button__content u__f-700">
                      <div
                        className="c__button__icon d-flex ms-0"
                        style={{ marginRight: "0.5rem" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          fill="none"
                          viewBox="0 0 17 17"
                        >
                          <path
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.667"
                            d="m15.833 15.834-3.625-3.625M14.166 7.5a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0"
                          ></path>
                        </svg>
                      </div>
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
          </div>
        </div>
        <div className="container b__u-careers__index-hero__images-container">
          <div className="b__u-careers__index-hero__images-wrapper">
            <div className="row">
              <div className="col-lg-4">
                <div className="c__image-wrapper">
                  <figure className="m-0 d-inline">
                    <Image
                      src="https://www.taylor.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/03%20Careers%20Center/NEW%20Careers%202026/Browse%20Jobs/Subdomain/no-border-radius/Careers-Subdomain-Hero-1.webp"
                      alt=""
                      width={4864}
                      height={1272}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      sizes="(max-width: 1216px) 100vw, 1216px"
                      unoptimized
                    />
                  </figure>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="c__image-wrapper">
                  <figure className="m-0 d-inline">
                    <Image
                      src="https://www.taylor.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/03%20Careers%20Center/NEW%20Careers%202026/Browse%20Jobs/Subdomain/no-border-radius/Careers-Subdomain-Hero-2.webp"
                      alt=""
                      width={4864}
                      height={1272}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      sizes="(max-width: 1216px) 100vw, 1216px"
                      unoptimized
                    />
                  </figure>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="c__image-wrapper">
                  <figure className="m-0 d-inline">
                    <Image
                      src="https://www.taylor.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/03%20Careers%20Center/NEW%20Careers%202026/Browse%20Jobs/Subdomain/no-border-radius/Careers-Subdomain-Hero-3.webp"
                      alt=""
                      width={4864}
                      height={1272}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      sizes="(max-width: 1216px) 100vw, 1216px"
                      unoptimized
                    />
                  </figure>
                </div>
              </div>
            </div>
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

      <section className="b__size-md b__u-careers__index-outro u__bg-blue-25">
        <div className="container">
          <div className="text-center mx-auto b__u-careers__index-outro__content-wrapper">
            <div className="c__heading-wrapper mb-4">
              <h2 className="c__heading u__h2 u__f-700 d-block u__heading-color--primary mb-0">
                Ready to love where you work?
              </h2>
            </div>
            <div className="c__description-wrapper">
              <p className="mb-0 u__h6">
                Each position at Taylor is part of a workplace built on
                collaboration, stability and growth. If you are ready to apply
                for a role where your work matters, Taylor makes it easy to
                search jobs and start your next chapter.
              </p>
            </div>

            <div className="c__button-wrapper mt-4">
              <a
                className="c__button__anchor-element"
                href="https://www.taylor.com/careers"
              >
                <span className="c__button c__button--with-icon c__button--type-squarish c__button--link c__button--size-xxxlarge">
                  <div className="c__button__content u__f-700">
                    <span>Careers</span>
                    <div className="c__button__icon">
                      <figure className="m-0">
                        <svg
                          width={14}
                          height={14}
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.16666 7.00008H12.8333M12.8333 7.00008L6.99999 1.16675M12.8333 7.00008L6.99999 12.8334"
                            stroke="#2458F1"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </figure>
                    </div>
                  </div>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="container mt-4 pt-4">
          <div className="c__image-wrapper">
            <figure className="m-0 d-inline">
              <Image
                src="https://www.taylor.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/03%20Careers%20Center/NEW%20Careers%202026/Browse%20Jobs/Subdomain/Careers-Featured-Image.webp"
                alt=""
                width={3648}
                height={648}
                loading="lazy"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                sizes="(max-width: 1320px) 100vw, 1320px"
                unoptimized
              />
            </figure>
          </div>
          <div className="b__u-careers__index-outro__grid-wrapper">
            <div className="row b__u-careers__index-outro__grid-row justify-content-center">
              {INDEX_OUTRO_CARDS.map(({ description, icon, title }) => (
                <div className="col-sm-6 col-md-4" key={title}>
                  <div className="b__u-careers__index-outro__card text-center">
                    <div className="c__icon-wrapper mb-3">{icon}</div>
                    <div className="c__heading-wrapper mb-3">
                      <h3 className="u__h5 c__heading u__f-700 d-block u__heading-color--primary mb-0">
                        {title}
                      </h3>
                    </div>
                    <div className="c__description-wrapper">
                      <p className="mb-0 u__p">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
