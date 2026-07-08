import { notFound, permanentRedirect } from "next/navigation";
import BackToPositionsButton from "@/app/components/BackToPositionsButton";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { JobDetailLoadingSkeleton } from "@/app/components/LoadingSkeletons";
import SimilarJobs from "@/app/components/SimilarJobs";
import { Tooltip } from "@/app/components/ui/tooltip";
import { getJobPageBreadcrumbs } from "@/app/lib/breadcrumbs";
import {
  fetchJobs,
  getJobBySlug,
  buildWorkdayUrl,
  parseLocation,
  buildJobPath,
  excerptDescription,
} from "@/app/lib/jobs";
import { formatRichTextHtml } from "@/app/lib/richText";
import { buildSeoMetadata } from "@/app/lib/seo";

const ABOUT_TAYLOR_URL = "https://www.taylor.com/about-us";

function shouldLoadSkeleton(searchParams) {
  return searchParams?.load_skeleton === "true";
}

function cleanLocationLabel(value = "") {
  return value
    .replace(/\s*,?\s*More(?:\.{1,3}|…)?$/i, "")
    .split(" - ")[0]
    .trim();
}

function getJobLocations(job) {
  const fullLocations = (job.locations || "")
    .split(";")
    .map((location) => location.trim())
    .filter(Boolean);
  const primaryFullLocation =
    fullLocations[0] ||
    cleanLocationLabel(job.locationsText || "") ||
    job.Job_Requisition_Primary_Location ||
    "";
  const locations = [primaryFullLocation, ...fullLocations].filter(Boolean);

  return [...new Set(locations)];
}

function MetaIcon({ type }) {
  if (type === "clock") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M7.00033 3.49984V6.99984L9.33366 8.1665M12.8337 6.99984C12.8337 10.2215 10.222 12.8332 7.00033 12.8332C3.77866 12.8332 1.16699 10.2215 1.16699 6.99984C1.16699 3.77818 3.77866 1.1665 7.00033 1.1665C10.222 1.1665 12.8337 3.77818 12.8337 6.99984Z"
          stroke="#2458F1"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "sparkle") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4.88675 9.10952L1.58691 12.4094M6.82206 3.8744L5.91155 4.78492C5.83727 4.85919 5.80014 4.89633 5.75783 4.92584C5.72027 4.95203 5.67976 4.97371 5.63714 4.99043C5.58912 5.00926 5.53762 5.01956 5.43462 5.04016L3.29702 5.46768C2.74151 5.57878 2.46375 5.63434 2.33381 5.78078C2.2206 5.90836 2.16891 6.0791 2.19233 6.24805C2.21922 6.44198 2.41951 6.64227 2.82009 7.04286L6.95344 11.1762C7.35402 11.5768 7.55432 11.7771 7.74825 11.804C7.9172 11.8274 8.08793 11.7757 8.21551 11.6625C8.36196 11.5325 8.41751 11.2548 8.52861 10.6993L8.95614 8.56168C8.97674 8.45868 8.98704 8.40718 9.00587 8.35916C9.02259 8.31653 9.04427 8.27603 9.07046 8.23847C9.09997 8.19616 9.13711 8.15902 9.21138 8.08475L10.1219 7.17423C10.1694 7.12675 10.1931 7.103 10.2192 7.08227C10.2424 7.06386 10.267 7.04723 10.2927 7.03255C10.3216 7.01601 10.3525 7.00279 10.4142 6.97633L11.8692 6.35274C12.2937 6.17082 12.506 6.07985 12.6024 5.93286C12.6867 5.80432 12.7169 5.6477 12.6863 5.49704C12.6514 5.32475 12.4881 5.16147 12.1616 4.83491L9.16139 1.83474C8.83483 1.50818 8.67154 1.3449 8.49926 1.30997C8.3486 1.27943 8.19197 1.30959 8.06343 1.3939C7.91644 1.49031 7.82548 1.70256 7.64356 2.12705L7.01997 3.58209C6.99351 3.64382 6.98029 3.67468 6.96375 3.70362C6.94906 3.72933 6.93244 3.75389 6.91402 3.77707C6.89329 3.80317 6.86955 3.82692 6.82206 3.8744Z"
          stroke="#2458F1"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "file") {
    return (
      <svg
        width="11"
        height="13"
        viewBox="0 0 11 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6.41634 0.740723V3.15021C6.41634 3.4769 6.41634 3.64025 6.47992 3.76503C6.53585 3.87479 6.62509 3.96403 6.73485 4.01996C6.85963 4.08354 7.02298 4.08354 7.34968 4.08354H9.75916M6.41634 9.3335H2.91634M7.58301 7.00016H2.91634M9.91634 5.24329V9.45016C9.91634 10.4303 9.91634 10.9203 9.7256 11.2946C9.55782 11.6239 9.29011 11.8916 8.96083 12.0594C8.58648 12.2502 8.09643 12.2502 7.11634 12.2502H3.38301C2.40292 12.2502 1.91287 12.2502 1.53852 12.0594C1.20924 11.8916 0.941525 11.6239 0.773746 11.2946C0.583008 10.9203 0.583008 10.4303 0.583008 9.45016V3.3835C0.583008 2.4034 0.583008 1.91336 0.773746 1.53901C0.941525 1.20973 1.20924 0.942013 1.53852 0.774235C1.91287 0.583496 2.40292 0.583496 3.38301 0.583496H5.25654C5.68458 0.583496 5.89859 0.583496 6.1 0.631849C6.27856 0.674718 6.44926 0.745426 6.60584 0.841376C6.78244 0.949599 6.93378 1.10093 7.23644 1.4036L9.09624 3.26339C9.39891 3.56606 9.55024 3.71739 9.65846 3.894C9.75441 4.05057 9.82512 4.22128 9.86799 4.39984C9.91634 4.60124 9.91634 4.81526 9.91634 5.24329Z"
          stroke="#2458F1"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.99967 7.58317C7.96617 7.58317 8.74967 6.79967 8.74967 5.83317C8.74967 4.86667 7.96617 4.08317 6.99967 4.08317C6.03318 4.08317 5.24967 4.86667 5.24967 5.83317C5.24967 6.79967 6.03318 7.58317 6.99967 7.58317Z"
        stroke="#2458F1"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.99967 12.8332C9.33301 10.4998 11.6663 8.4105 11.6663 5.83317C11.6663 3.25584 9.577 1.1665 6.99967 1.1665C4.42235 1.1665 2.33301 3.25584 2.33301 5.83317C2.33301 8.4105 4.66634 10.4998 6.99967 12.8332Z"
        stroke="#2458F1"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const allJobs = await fetchJobs();
  const job = getJobBySlug(allJobs, id);
  if (!job) {
    return buildSeoMetadata({
      title: "Job Not Found | Taylor",
      description: "The requested Taylor Careers job could not be found.",
      path: `/job/${id}`,
      robots: { index: false, follow: false },
    });
  }
  const canonicalPath = buildJobPath(job);
  const location = parseLocation(job);
  const fallbackDescription = `${job.jobFamilyGroup ?? "Open position"} at Taylor${
    location ? ` - ${location}` : ""
  }.`;

  return buildSeoMetadata({
    title: `${job.title} | Taylor Careers`,
    description: job.jobDescription
      ? excerptDescription(job.jobDescription, 155)
      : fallbackDescription,
    path: canonicalPath,
    type: "article",
  });
}

export default async function JobDetailPage({ params, searchParams }) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  if (shouldLoadSkeleton(resolvedSearchParams)) {
    return <JobDetailLoadingSkeleton />;
  }

  const allJobs = await fetchJobs();
  const job = getJobBySlug(allJobs, id);

  if (!job) notFound();

  const canonicalPath = buildJobPath(job);
  if (canonicalPath && canonicalPath !== `/job/${id}`) {
    permanentRedirect(canonicalPath);
  }

  const applyUrl = buildWorkdayUrl(job.externalPath);
  const locations = getJobLocations(job);
  const primaryLocation = locations[0] || parseLocation(job);
  const location = cleanLocationLabel(primaryLocation);
  const additionalLocations = locations.slice(1);
  const locationText =
    additionalLocations.length > 0 ? `${location} and More` : location;
  const locationTooltip = locations.join("\n");
  const hasAdditionalLocations = additionalLocations.length > 0;
  const locationChipClassName = `b__u-careers__job-detail__meta-chip b__u-careers__job-detail__meta-chip--location${
    locationTooltip ? " b__u-careers__job-detail__meta-chip--has-tooltip" : ""
  }`;
  const jobDescriptionHtml = formatRichTextHtml(job.jobDescription || "");
  const topMeta = [
    { value: job.timeType || job.workerSubType, icon: "clock" },
    { value: job.postedOn, icon: "sparkle" },
    { value: job.jobRequisitionId, icon: "file" },
  ].filter((item) => item.value);

  return (
    <>
      {/* <Breadcrumbs items={getJobPageBreadcrumbs(job)} /> */}
      <section className="b__u-careers__job-detail">
        <div className="container">
          <div className="b__u-careers__job-detail__shell">
            <BackToPositionsButton />

            <div className="b__u-careers__job-detail__hero">
              <div className="b__u-careers__job-detail__hero__content">
                {job.jobFamilyGroup && (
                  <div className="mb-3">
                    <span className="b__u-careers__job-detail__eyebrow c__heading u__h5 u__f-700 d-block u__text-purple mb-0">
                      {job.jobFamilyGroup}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h1 className="c__heading u__h2 u__f-700 d-block u__heading-color--primary mb-0">
                    {job.title}
                  </h1>
                </div>
                {(location || topMeta.length > 0) && (
                  <div className="b__u-careers__job-detail__meta">
                    {location && (
                      <Tooltip
                        content={locationTooltip}
                        side="top"
                        sideOffset={10}
                      >
                        <span
                          className={locationChipClassName}
                          tabIndex={locationTooltip ? 0 : undefined}
                          aria-label={
                            locationTooltip
                              ? `${locationText}. Full location details: ${locations.join(", ")}`
                              : undefined
                          }
                        >
                          <MetaIcon type="location" />
                          {locationText}
                        </span>
                      </Tooltip>
                    )}
                    {topMeta.map((item) => (
                      <span
                        key={item.value}
                        className="b__u-careers__job-detail__meta-chip"
                      >
                        <MetaIcon type={item.icon} />
                        {item.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <aside className="b__u-careers__job-detail__hero__aside">
                {applyUrl && (
                  <a
                    href={applyUrl + "/apply"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="c__button__anchor-element b__u-careers__job-detail__apply-link"
                  >
                    <span className="c__button c__button--primary c__button--type-squarish u__f-700 w-100 text-center">
                      <div className="c__button__content u__f-700">
                        <span>Apply</span>
                      </div>
                    </span>
                  </a>
                )}
                <a
                  href={ABOUT_TAYLOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c__button__anchor-element b__u-careers__job-detail__about-link"
                >
                  <span className="c__button c__button--with-icon c__button--ghost c__button--ghost--bg-blue-25  c__button--type-squarish u__f-700 w-100">
                    <div className="c__button__content u__f-700 justify-content-center">
                      <span>About Taylor</span>
                      <div className="c__button__icon">
                        <figure className="m-0">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M5 15L15 5M15 11.6667V5H8.33333"
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
              </aside>
            </div>

            {jobDescriptionHtml && (
              <div className="b__u-careers__job-detail__content-card">
                {/* <div className="c__heading-wrapper mb-3">
                  <h2 className="c__heading u__h5 u__f-700 d-block u__heading-color--primary mb-0">
                    Job Description
                  </h2>
                </div> */}
                <div
                  className="b__u-careers__job-detail__richtext"
                  dangerouslySetInnerHTML={{ __html: jobDescriptionHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
      <SimilarJobs jobs={allJobs} currentJob={job} />
    </>
  );
}
