import { notFound } from "next/navigation";
import Link from "@/app/components/CustomLink";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import FaqAccordion from "@/app/components/FaqAccordion";
import JobCard from "@/app/components/JobCard";
import LocationDirectory from "@/app/components/LocationDirectory";
import LocationImageCarousel from "@/app/components/LocationImageCarousel";
import { getLocationPages, getLocationStates, getLocationBySlug, getStateBySlug, getCitiesWithJobCounts, getLocationBreadcrumbs, jobMatchesLocation, buildLocationSearchResultsPath } from "@/app/lib/locationContent";
import { fetchJobs, sortJobsByNewest } from "@/app/lib/jobs";
import { buildSeoMetadata } from "@/app/lib/seo";

export const dynamicParams = false;
export const revalidate = 900;

export function generateStaticParams() {
  return [...getLocationStates(), ...getLocationPages()].map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  const location = getLocationBySlug(slug);
  if (!state && !location) notFound();
  return buildSeoMetadata({
    title: location?.meta_title || `Browse Jobs by Location: ${state.name} | Taylor Careers`,
    description: location?.meta_description || `Explore Taylor jobs in ${state.name}. Browse our locations by city and find open positions.`,
    path: `/locations/${slug}`,
    image: location?.images[0]?.src,
  });
}

export default async function LocationPage({ params }) {
  const { slug } = await params;
  const directoryState = getStateBySlug(slug);
  const locationPage = getLocationBySlug(slug);
  if (!directoryState && !locationPage) notFound();
  const jobs = await fetchJobs();
  if (directoryState) return <LocationDirectory state={directoryState} entries={getCitiesWithJobCounts(jobs, directoryState.code)} />;
  const state = getLocationStates().find((state) => state.code === locationPage.state);
  const locationJobs = sortJobsByNewest(jobs.filter((job) => jobMatchesLocation(job, locationPage)));
  const featuredJobs = locationJobs.slice(0, 3);
  const hasLocationJobs = locationJobs.length > 0;
  const searchResultsPath = buildLocationSearchResultsPath(locationPage);

  return (
    <>
      <Breadcrumbs
        items={getLocationBreadcrumbs(state, locationPage)}
        currentPath={`/locations/${locationPage.slug}`}
      />
      <section className="b__size-md b__u-careers__category-hero">
        <div className="container">
          <div className="b__u-careers__category-hero__content-wrapper">
            <div className="row b__u-careers__category-hero__grid-row align-items-center">
              <div className="col-lg-6">
                <div className="c__heading-wrapper mb-3">
                  <h1 className="c__heading u__h2 u__f-700 d-block u__heading-color--primary mb-0">
                    {locationPage.heading}
                  </h1>
                </div>
                {locationPage.description ? (
                  <div className="c__description-wrapper">
                    <p className="mb-0 u__h6">{locationPage.description}</p>
                  </div>
                ) : null}
                {hasLocationJobs ? (
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
                ) : null}
              </div>
              <div className="col-lg-6">
                <LocationImageCarousel images={locationPage.images} label={`${locationPage.city}, ${locationPage.state}`} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="b__size-md b__u-careers__category-openings">
        <div className="container">
          <div className="c__heading-wrapper mb-4 text-center">
            <h2 className="c__heading u__h3 u__f-700 d-block u__heading-color--primary mb-0">
              {locationPage.openingsHeading}{" "}
              <span className="u__f-400">({locationJobs.length})</span>
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
                  There are no open roles in this location right now.
                </p>
              </div>
            )}
          </div>
        </div>
        {hasLocationJobs ? (
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
        ) : null}
      </section>
      {locationPage.faqs.length > 0 ? (
        <section className="b__size-md b__faq__faqs-with-content">
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
                faqs={locationPage.faqs}
                moduleId={`location-${locationPage.slug}-faqs`}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section
        className={`b__size-md${locationPage.faqs.length > 0 ? " pt-3" : ""} b__cta__strip-var-05`}
      >
        <div className="container">
          <div
            style={{ background: " var(--t-cp-primary-blue)" }}
            className="mx-auto b__cta__strip-var-05__wrapper"
          >
            <div className="b__cta__strip-var-05__content-wrapper text-center u__text-inverted">
              <div className="c__heading-wrapper mb-3">
                <span className="c__heading u__h2 u__f-700 mb-2 d-block">
                  Big Ideas Happen Here
                </span>
              </div>

              <div className="c__subheading-wrapper mb-4">
                <span className="c__heading u__h5 u__f-400 mb-2 d-block">
                  Discover a place where collaboration builds{" "}
                  <br className="u__show-after-992" />
                  community and values drive vision.
                </span>
              </div>

              <div className="b__cta__strip-var-05__button-wrapper mt-4 pt-2">
                <Link className="c__button__anchor-element" href="/">
                  <span className="c__button c__button--with-icon c__button--inverted c__button--cta--var-02 c__button--rounded">
                    <div className="c__button__content u__f-700">
                      <span>Careers</span>
                      <div className="c__button__icon">
                        <figure className="m-0">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.16699 10.0003H15.8337M10.0003 15.8337L15.8337 10.0003L10.0003 4.16699"
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
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
