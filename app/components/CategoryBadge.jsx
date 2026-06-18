import Link from "@/app/components/CustomLink";
import Image from "next/image";

function ChevronRight() {
  return (
    <svg
      aria-hidden="true"
      className="c__u-careers__category-badge__chevron"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CategoryBadge({ category, href }) {
  return (
    <Link className="c__u-careers__category-badge" href={href}>
      <span className="c__u-careers__category-badge__icon" aria-hidden="true">
        {category.icon_raw ? (
          <Image
            src={category.icon_raw}
            alt=""
            width={30}
            height={30}
            loading="lazy"
            unoptimized
          />
        ) : null}
      </span>
      <span className="c__u-careers__category-badge__label u__h6 u__f-700">
        {category.category}
      </span>
      <ChevronRight />
    </Link>
  );
}
