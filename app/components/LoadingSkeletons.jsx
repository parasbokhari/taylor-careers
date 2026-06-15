function SkeletonBlock({ className = "" }) {
  return (
    <div className={`c__skeleton-block ${className}`} aria-hidden="true" />
  );
}

function SkeletonFilterItem({ modifier = "" }) {
  return (
    <div className={`c__filter-bar__filter-list__filters__col ${modifier}`}>
      <div className="c__filter-item c__skeleton-filter-item">
        <div className="c__filter-item__label-wrapper">
          <SkeletonBlock className="c__skeleton-block--filter-label-text" />
          <div className="c__filter-item__figure-wrapper">
            <SkeletonBlock className="c__skeleton-block--chev" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonSearchForm() {
  return (
    <form className="c__job-board-embed__search-form" aria-hidden="true">
      <div className="c__job-board-embed__search-form__input-wrapper">
        <div className="c__job-board-embed__search-form__figure-wrapper">
          <SkeletonBlock className="c__skeleton-block--search-icon" />
        </div>
        <SkeletonBlock className="c__skeleton-block--search-text" />
      </div>
      <span className="c__job-board-embed__search-form__button-wrapper">
        <div className="c__job-board-embed__search-form__button c__button c__button--primary c__button--rounded u__f-700 c__skeleton-button-shell">
          <div className="c__button__content u__f-700" />
        </div>
      </span>
    </form>
  );
}

function SkeletonJobCard() {
  return (
    <div className="c__job-board-embed__job-card position-relative c__skeleton-job-card">
      <div className="c__job-board-embed__job-card__header mb-3">
        <div className="c__job-board-embed__job-card__header__row">
          <div className="c__job-board-embed__job-card__header__col c__job-board-embed__job-card__header__col--left">
            <div className="c__heading-wrapper">
              <SkeletonBlock className="c__skeleton-block--eyebrow" />
            </div>
          </div>
          <div className="c__job-board-embed__job-card__header__col c__job-board-embed__job-card__header__col--right">
            <div className="c__job-card__view-link c__skeleton-view-link">
              <SkeletonBlock className="c__skeleton-block--view-text" />
              <SkeletonBlock className="c__skeleton-block--view-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="c__job-board-embed__job-card__body mb-3">
        <div className="c__heading-wrapper mb-2">
          <SkeletonBlock className="c__skeleton-block--card-title" />
        </div>
        <div className="c__description-wrapper">
          <SkeletonBlock className="c__skeleton-block--description-line" />
          <SkeletonBlock className="c__skeleton-block--description-line c__skeleton-block--description-line-short" />
        </div>
      </div>

      <div className="c__job-board-embed__job-card__footer">
        <div className="c__job-board-embed__job-card__footer__row">
          <div className="c__job-board-embed__job-card__footer__col">
            <div className="c__job-board-embed__job-card__meta c__job-board-embed__job-card__meta--location">
              <div className="c__job-board-embed__job-card__meta__icon-wrapper">
                <SkeletonBlock className="c__skeleton-block--meta-icon" />
              </div>
              <div className="c__job-board-embed__job-card__meta__label-wrapper">
                <SkeletonBlock className="c__skeleton-block--meta-label c__skeleton-block--meta-label-location" />
              </div>
            </div>
          </div>
          <div className="c__job-board-embed__job-card__footer__col">
            <div className="c__job-board-embed__job-card__meta c__job-board-embed__job-card__meta--position-type">
              <div className="c__job-board-embed__job-card__meta__icon-wrapper">
                <SkeletonBlock className="c__skeleton-block--meta-icon" />
              </div>
              <div className="c__job-board-embed__job-card__meta__label-wrapper">
                <SkeletonBlock className="c__skeleton-block--meta-label" />
              </div>
            </div>
          </div>
          <div className="c__job-board-embed__job-card__footer__col u__show-after-768 ms-md-auto">
            <div className="c__job-board-embed__job-card__meta">
              <div className="c__job-board-embed__job-card__meta__label-wrapper">
                <SkeletonBlock className="c__skeleton-block--posted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonBoardHeader() {
  return (
    <div className="c__job-board-embed__board__header">
      <div className="c__job-board-embed__board__header__row">
        <div className="c__job-board-embed__board__header__col c__job-board-embed__board__header__col--left">
          <div className="c__heading-wrapper">
            <SkeletonBlock className="c__skeleton-block--openings-count" />
          </div>
        </div>
        <div className="c__job-board-embed__board__header__col c__job-board-embed__board__header__col--right">
          <div className="c__job-board-embed__board__header__sort-box c__skeleton-sort-box">
            <SkeletonBlock className="c__skeleton-block--sort-text" />
            <SkeletonBlock className="c__skeleton-block--chev" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonParagraphSet() {
  return (
    <>
      <SkeletonBlock className="c__skeleton-block--paragraph" />
      <SkeletonBlock className="c__skeleton-block--paragraph" />
      <SkeletonBlock className="c__skeleton-block--paragraph c__skeleton-block--paragraph-short" />
      <div className="c__skeleton-list">
        <SkeletonBlock className="c__skeleton-block--list-item" />
        <SkeletonBlock className="c__skeleton-block--list-item" />
        <SkeletonBlock className="c__skeleton-block--list-item" />
      </div>
      <SkeletonBlock className="c__skeleton-block--paragraph" />
      <SkeletonBlock className="c__skeleton-block--paragraph c__skeleton-block--paragraph-medium" />
    </>
  );
}

export function JobBoardLoadingSkeleton() {
  return (
    <section className="b__size-md">
      <div className="container">
        <div
          className="c__job-board-embed c__skeleton-page"
          aria-label="Loading jobs"
        >
          <div className="c__job-board-embed__header">
            <div className="c__job-board-embed__header__row">
              <div className="c__job-board-embed__header__col c__job-board-embed__header__col--left">
                <div className="c__heading-wrapper">
                  <SkeletonBlock className="c__skeleton-block--page-heading" />
                </div>
              </div>
              <div className="c__job-board-embed__header__col c__job-board-embed__header__col--right">
                <SkeletonSearchForm />
              </div>
            </div>
          </div>

          <div className="c__job-board-embed__filter-bar mt-4 pt-1 pt-sm-2 pt-md-3 pt-lg-4">
            <div className="c__filter-bar__row">
              <div className="c__filter-bar__col c__filter-bar__col--left">
                <div className="c__filter-bar__filter-list c__filter-bar__filter-list--mobile u__hide-after-992">
                  <div className="c__filter-bar__filter-list__row">
                    <div className="c__filter-bar__filter-list__col c__filter-bar__filter-list__col--left">
                      <div className="c__filter-bar__filter-list__label-wrapper">
                        <SkeletonBlock className="c__skeleton-block--filter-heading" />
                      </div>
                    </div>
                    <div className="c__filter-bar__filter-list__col c__filter-bar__filter-list__col--right">
                      <div className="c__filter-bar__filter-list__filters">
                        <div className="c__filter-bar__filter-list__filters__row">
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--1" />
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--2" />
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--3" />
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--4" />
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="c__filter-bar__filter-list c__filter-bar__filter-list--desktop u__show-after-992">
                  <div className="c__filter-bar__filter-list__row">
                    <div className="c__filter-bar__filter-list__col c__filter-bar__filter-list__col--left">
                      <div className="c__filter-bar__filter-list__label-wrapper">
                        <SkeletonBlock className="c__skeleton-block--filter-heading" />
                      </div>
                    </div>
                    <div className="c__filter-bar__filter-list__col c__filter-bar__filter-list__col--right">
                      <div className="c__filter-bar__filter-list__filters">
                        <div className="c__filter-bar__filter-list__filters__row">
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--1" />
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--2" />
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--3" />
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--4" />
                          <SkeletonFilterItem modifier="c__filter-bar__filter-list__filters__col--5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="c__filter-bar__col c__filter-bar__col--right u__show-after-992" />
            </div>
          </div>

          <div className="c__job-board-embed__body">
            <div className="c__job-board-embed__board mt-4 pt-4">
              <SkeletonBoardHeader />
              <div className="c__job-board-embed__board__body mt-4">
                <SkeletonJobCard />
                <SkeletonJobCard />
                <SkeletonJobCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JobDetailLoadingSkeleton() {
  return (
    <div
      className="b__u-careers__job-detail c__skeleton-page"
      aria-label="Loading job details"
    >
      <div className="container">
        <div className="b__u-careers__job-detail__shell">
          <div className="b__u-careers__job-detail__back-link c__skeleton-back-link">
            <SkeletonBlock className="c__skeleton-block--back-icon" />
            <SkeletonBlock className="c__skeleton-block--back-text" />
          </div>

          <section className="b__u-careers__job-detail__hero">
            <div className="b__u-careers__job-detail__hero__content">
              <SkeletonBlock className="c__skeleton-block--detail-eyebrow" />
              <SkeletonBlock className="c__skeleton-block--detail-title" />
              <div className="b__u-careers__job-detail__meta">
                <SkeletonBlock className="c__skeleton-block--detail-chip c__skeleton-block--detail-chip-location" />
                <SkeletonBlock className="c__skeleton-block--detail-chip" />
                <SkeletonBlock className="c__skeleton-block--detail-chip" />
                <SkeletonBlock className="c__skeleton-block--detail-chip" />
              </div>
            </div>
            <aside className="b__u-careers__job-detail__hero__aside">
              <div className="c__button__anchor-element b__u-careers__job-detail__apply-link">
                <span className="c__button c__button--primary c__button--size-xxlarge c__button--type-squarish u__f-700 c__skeleton-button-shell">
                  <span className="c__button__content u__f-700" />
                </span>
              </div>
              <div className="c__button__anchor-element b__u-careers__job-detail__about-link">
                <span className="c__button c__button--ghost c__button--size-xxlarge c__button--type-squarish u__f-700 c__skeleton-button-shell">
                  <SkeletonBlock className="c__skeleton-block--apply-text" />
                </span>
              </div>
            </aside>
          </section>

          <section className="b__u-careers__job-detail__content-card">
            <div className="c__heading-wrapper mb-3">
              <SkeletonBlock className="c__skeleton-block--section-title" />
            </div>
            <div className="b__u-careers__job-detail__richtext">
              <SkeletonParagraphSet />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
