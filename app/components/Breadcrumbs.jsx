import Link from "next/link";

function BreadcrumbSeparator({ id }) {
  const clipPathId = `breadcrumb-separator-clip-${id}`;

  return (
    <div className="c__breadcrumbs__item__column c__breadcrumbs__item__column-right">
      <figure className="m-0 d-flex">
        <svg
          width="5"
          height="17"
          viewBox="0 0 5 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g clipPath={`url(#${clipPathId})`}>
            <path
              d="M0.966 13.626C0.91 13.766 0.826 13.87 0.714 13.938C0.606 14.006 0.494 14.04 0.378 14.04H-0.072L3.534 5.058C3.586 4.93 3.66 4.832 3.756 4.764C3.852 4.696 3.966 4.662 4.098 4.662H4.548L0.966 13.626Z"
              fill="#25282A"
            />
          </g>
          <defs>
            <clipPath id={clipPathId}>
              <rect y="0.5" width="5" height="16" rx="2.5" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </figure>
    </div>
  );
}

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="module_171642753114233 b__site-header__global-breadcrumbs b__site-header__global-site-header--compatible">
      <div className="container b__site-header__global-site-header__container">
        <nav
          aria-label="Breadcrumb"
          className="c__breadcrumbs c__breadcrumbs--var-header"
        >
          <ul className="c__breadcrumbs__list">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li
                  className={`c__breadcrumbs__item${
                    isLast ? " c__breadcrumbs__item--active" : ""
                  }`}
                  key={`${item.href || item.label}-${index}`}
                >
                  <div className="c__breadcrumbs__item__row">
                    <div className="c__breadcrumbs__item__column c__breadcrumbs__item__column-left">
                      <div
                        className={`c__breadcrumbs__item__text-content${
                          isLast ? " u__truncate" : ""
                        }`}
                      >
                        {item.href && !isLast ? (
                          <Link
                            className="u__inherited-anchor"
                            href={item.href}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span className="u__inherited-anchor">
                            {item.label}
                          </span>
                        )}
                      </div>
                    </div>
                    {!isLast ? <BreadcrumbSeparator id={index} /> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
