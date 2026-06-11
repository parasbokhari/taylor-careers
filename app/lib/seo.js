const SITE_NAME = "Taylor Careers";
const DEFAULT_TITLE = "Taylor Careers";
const DEFAULT_DESCRIPTION = "Explore careers and open positions at Taylor.";
const DEFAULT_OG_IMAGE = "/opengraph-image";
const TEMPORARY_SITEWIDE_NOINDEX = true;
const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
};

function getRobotsConfig(robots = DEFAULT_ROBOTS) {
  return TEMPORARY_SITEWIDE_NOINDEX
    ? {
        ...robots,
        index: false,
      }
    : robots;
}

export function buildSeoMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  robots,
  publishedTime,
  modifiedTime,
} = {}) {
  const images = image
    ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type,
      images,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: getRobotsConfig(robots),
  };
}
