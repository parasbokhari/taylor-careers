const SITE_NAME = "Taylor Careers";
const DEFAULT_TITLE = "Taylor Careers";
const DEFAULT_DESCRIPTION = "Explore careers and open positions at Taylor.";
const DEFAULT_OG_IMAGE =
  "https://www.taylor.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/03%20Careers%20Center/NEW%20Careers%202026/Careers%20Main/featured-image-careers.jpg";
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
        follow: false,
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
