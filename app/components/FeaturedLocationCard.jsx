import Image from "next/image";
import Link from "@/app/components/CustomLink";

export default function FeaturedLocationCard({ location, count }) {
  const photo = location.images[0];
  return (
    <Link
      className="location-featured__card"
      href={`/locations/${location.slug}`}
    >
      <span className="location-featured__photo" aria-hidden="true">
        {photo ? <Image src={photo.src} alt="" fill sizes="46px" /> : null}
      </span>
      <h3 className="location-featured__card-text">
        <strong className="u__h6">
          {location.city}, {location.state}
        </strong>
        <span className="u__p">
          {count} {count === 1 ? "Job" : "Jobs"}
        </span>
      </h3>
      <Image
        className="location-featured__chevron"
        src="/figma/location-card-chevron-right.svg"
        alt=""
        width={20}
        height={20}
        unoptimized
      />
    </Link>
  );
}
