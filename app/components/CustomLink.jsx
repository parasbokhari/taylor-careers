import NextLink from "next/link";

const USE_ANCHOR_FOR_INTERNAL_LINKS = true;

function getHrefString(href) {
  if (typeof href === "string") return href;
  if (href instanceof URL) return href.toString();

  const pathname = href?.pathname || "";
  const hash = href?.hash ? `#${String(href.hash).replace(/^#/, "")}` : "";
  const searchParams = new URLSearchParams();

  Object.entries(href?.query || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const search = searchParams.toString();

  return `${pathname}${search ? `?${search}` : ""}${hash}`;
}

function isInternalHref(href) {
  const hrefString = getHrefString(href);
  return hrefString.startsWith("/") && !hrefString.startsWith("//");
}

export default function CustomLink({
  href,
  prefetch,
  replace,
  scroll,
  locale,
  onNavigate,
  transitionTypes,
  ...props
}) {
  const shouldUseAnchor =
    !isInternalHref(href) || USE_ANCHOR_FOR_INTERNAL_LINKS;

  if (shouldUseAnchor) {
    return <a href={getHrefString(href)} {...props} />;
  }

  return (
    <NextLink
      href={href}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      locale={locale}
      onNavigate={onNavigate}
      transitionTypes={transitionTypes}
      {...props}
    />
  );
}
