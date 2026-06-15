import Link from "next/link";
import { buildJobPath, parseLocation } from "@/app/lib/jobs";

function LocationIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12.5C13.6569 12.5 15 11.1569 15 9.5C15 7.84315 13.6569 6.5 12 6.5C10.3431 6.5 9 7.84315 9 9.5C9 11.1569 10.3431 12.5 12 12.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.833 14.167L14.167 5.833M14.167 5.833H5.833M14.167 5.833V14.167"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SimilarJobs({ jobs = [], currentJob }) {
  const similarJobs = jobs
    .filter((job) => job.jobRequisitionId !== currentJob.jobRequisitionId)
    .filter((job) => job.jobFamilyGroup === currentJob.jobFamilyGroup)
    .slice(0, 3);

  const fallbackJobs = jobs
    .filter((job) => job.jobRequisitionId !== currentJob.jobRequisitionId)
    .filter((job) => !similarJobs.includes(job))
    .slice(0, 3 - similarJobs.length);

  const visibleJobs = [...similarJobs, ...fallbackJobs];

  if (visibleJobs.length === 0) return null;

  return (
    <section className="c__similar-jobs">
      <div className="container">
        <h2 className="c__similar-jobs__title">Similar Jobs</h2>
        <div className="c__similar-jobs__grid">
          {visibleJobs.map((job) => {
            const jobPath = buildJobPath(job);
            if (!jobPath) return null;

            return (
              <article
                className="c__similar-jobs__card"
                key={job.jobRequisitionId || job.externalPath}
              >
                {job.jobFamilyGroup && (
                  <p className="c__similar-jobs__category">
                    {job.jobFamilyGroup}
                  </p>
                )}
                <h3 className="c__similar-jobs__job-title">{job.title}</h3>
                <div className="c__similar-jobs__meta">
                  <span>
                    <LocationIcon />
                    {parseLocation(job)}
                  </span>
                  {job.timeType && (
                    <span>
                      <ClockIcon />
                      {job.timeType}
                    </span>
                  )}
                </div>
                <Link href={jobPath} className="c__similar-jobs__link">
                  <span>View Job</span>
                  <ArrowIcon />
                </Link>
              </article>
            );
          })}
        </div>
        <div className="text-center">
          <Link href="/" className="c__button__anchor-element">
            <span className="c__button c__button--primary c__similar-jobs__browse-button">
              <span className="c__button__content u__f-700">
                Browse Open Jobs
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
