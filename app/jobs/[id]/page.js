import { notFound, permanentRedirect } from "next/navigation";
import BackToPositionsButton from "@/app/components/BackToPositionsButton";
import {
  fetchJobs,
  getJobBySlug,
  buildWorkdayUrl,
  parseLocation,
  buildJobPath,
} from "@/app/lib/jobs";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const allJobs = await fetchJobs();
  const job = getJobBySlug(allJobs, id);
  if (!job) return { title: "Job Not Found | Taylor" };
  return {
    title: `${job.title} | Taylor Careers`,
    description: `${job.jobFamilyGroup ?? "Open position"} at Taylor — ${parseLocation(job)}`,
  };
}

export default async function JobDetailPage({ params }) {
  const { id } = await params;
  const allJobs = await fetchJobs();
  const job = getJobBySlug(allJobs, id);

  if (!job) notFound();

  const canonicalPath = buildJobPath(job);
  if (canonicalPath && canonicalPath !== `/jobs/${id}`) {
    permanentRedirect(canonicalPath);
  }

  const applyUrl = buildWorkdayUrl(job.externalPath);
  const location = parseLocation(job);
  const topMeta = [job.workerSubType, job.timeType, job.postedOn].filter(Boolean);

  return (
    <main className="c__job-detail">
      <div className="container">
        <div className="c__job-detail__shell">
          <BackToPositionsButton />

          <section className="c__job-detail__hero">
            <div className="c__job-detail__hero__content">
              {job.jobFamilyGroup && (
                <span className="c__job-detail__eyebrow">{job.jobFamilyGroup}</span>
              )}
              <h1 className="c__job-detail__title">{job.title}</h1>
              {(location || topMeta.length > 0) && (
                <div className="c__job-detail__meta">
                  {location && (
                    <span className="c__job-detail__meta-chip c__job-detail__meta-chip--location">
                      {location}
                    </span>
                  )}
                  {topMeta.map((item) => (
                    <span key={item} className="c__job-detail__meta-chip">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <aside className="c__job-detail__hero__aside">
              {job.jobRequisitionId && (
                <div className="c__job-detail__stat">
                  <span className="c__job-detail__stat-label">Req ID</span>
                  <span className="c__job-detail__stat-value">{job.jobRequisitionId}</span>
                </div>
              )}
              {applyUrl && (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c__button c__button--primary c__button--rounded c__job-detail__apply-button"
                >
                  <span className="c__button__content u__f-700">
                    <span>Apply on Workday</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M7 17L17 7M17 7H9M17 7V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              )}
            </aside>
          </section>

          {job.jobDescription && (
            <section className="c__job-detail__content-card">
              <div className="c__heading-wrapper mb-3">
                <h2 className="c__heading u__h5 u__f-700 d-block u__heading-color--primary mb-0">
                  Job Description
                </h2>
              </div>
              <div
                className="c__job-detail__rich-text"
                dangerouslySetInnerHTML={{ __html: job.jobDescription }}
              />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
