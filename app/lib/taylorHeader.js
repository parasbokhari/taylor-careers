const HEADER_SOURCE_URL = "https://www.taylor.com/";
const HEADER_MODULE_ID = "module_171642753114233";
const TRACKING_PARAMS = ["__hstc", "__hssc", "__hsfp"];

const FALLBACK_HEADER_HTML = `
<div data-global-resource-path="Taylor II/templates/partials/header.html" class="u__sticky-header">
  <header id="${HEADER_MODULE_ID}" class="${HEADER_MODULE_ID} b__site-header__global-site-header">
    <div class="b__site-header__global-site-header__wrapper">
      <div class="container b__site-header__global-site-header__container">
        <a role="button" href="#main-content" class="c__button--skip-to-content c__button__anchor-element">
          <span class="c__button c__button--primary u__f-700">
            <span class="c__button__content u__f-700">
              <span>Skip to Content</span>
            </span>
          </span>
        </a>
        <div class="b__site-header__global-site-header__row">
          <div class="b__site-header__global-site-header__col b__site-header__global-site-header__col--left">
            <div class="b__site-header__global-site-header__logo-wrapper">
              <a href="https://www.taylor.com/" aria-label="Taylor home">
                <figure class="m-0 d-inline">
                  <img src="https://www.taylor.com/hubfs/_Taylor.com%20-%20All%20file%20connected%20%20to%20main%20site%20and%20blogs/dev/Logo.svg" alt="Logo - Taylor Corporation" loading="lazy">
                </figure>
              </a>
            </div>
          </div>
          <div class="b__site-header__global-site-header__col b__site-header__global-site-header__col--right">
            <nav class="b__site-header__global-site-header__simple-actions" aria-label="Header actions">
              <a href="https://www.taylor.com/contact-us" class="c__button__anchor-element py-0 px-0">
                <span class="c__button c__button--primary">
                  <span class="c__button__content u__f-700">
                    <span>Contact Us</span>
                  </span>
                </span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </header>
</div>`;

function getTagEnd(html, startIndex) {
  const tagEnd = html.indexOf(">", startIndex);
  return tagEnd === -1 ? html.length : tagEnd + 1;
}

function extractBalancedElement(html, startIndex, tagName) {
  const openTagEnd = getTagEnd(html, startIndex);
  const tagPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  tagPattern.lastIndex = openTagEnd;

  let depth = 1;
  let match;

  while ((match = tagPattern.exec(html))) {
    const token = match[0];
    const isClosing = token.startsWith(`</`);
    const isSelfClosing = token.endsWith("/>");

    if (isClosing) {
      depth -= 1;
    } else if (!isSelfClosing) {
      depth += 1;
    }

    if (depth === 0) {
      return html.slice(startIndex, tagPattern.lastIndex);
    }
  }

  return html.slice(startIndex);
}

function extractHeaderHtml(pageHtml) {
  const wrapperStart = pageHtml.search(
    /<div\b[^>]*data-global-resource-path=["']Taylor II\/templates\/partials\/header\.html["'][^>]*>/i,
  );

  if (wrapperStart !== -1) {
    return extractBalancedElement(pageHtml, wrapperStart, "div");
  }

  const headerStart = pageHtml.search(
    new RegExp(`<header\\b[^>]*id=["']${HEADER_MODULE_ID}["'][^>]*>`, "i"),
  );

  if (headerStart === -1) {
    return null;
  }

  const headerHtml = extractBalancedElement(pageHtml, headerStart, "header");
  const afterHeader = pageHtml.slice(headerStart + headerHtml.length);
  const tintMatch = afterHeader.match(
    /<div\b[^>]*b__site-header__global-site-header__search-board__tint[^>]*><\/div>/i,
  );

  return tintMatch ? `${headerHtml}${afterHeader.slice(0, tintMatch.index + tintMatch[0].length)}` : headerHtml;
}

function extractModuleStyles(pageHtml) {
  const styles = [];
  const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let match;

  while ((match = stylePattern.exec(pageHtml))) {
    const css = match[1].trim();
    if (css.includes(HEADER_MODULE_ID) || css.includes("b__site-header")) {
      styles.push(css);
    }
  }

  return styles.join("\n");
}

function cleanUrl(value, attr) {
  if (!value || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return value;
  }

  if (value.trim().toLowerCase() === "javascript:;") {
    return "#";
  }

  try {
    const url = new URL(value, HEADER_SOURCE_URL);
    TRACKING_PARAMS.forEach((param) => url.searchParams.delete(param));

    if (attr === "action" && url.pathname === "/hs-search-results") {
      return url.toString();
    }

    if (value.startsWith("/")) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch {
    return value;
  }
}

function sanitizeHeaderHtml(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[\s\S]*?>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(["']).*?\1/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/\s(href|src|action)\s*=\s*(["'])(.*?)\2/gi, (_, attr, quote, value) => {
      return ` ${attr}=${quote}${cleanUrl(value, attr)}${quote}`;
    });
}

export async function getTaylorHeader() {
  try {
    const response = await fetch(HEADER_SOURCE_URL, {
      next: { revalidate: 3600, tags: ["taylor-global-header"] },
    });

    if (!response.ok) {
      throw new Error(`Taylor header fetch failed: ${response.status}`);
    }

    const pageHtml = await response.text();
    const headerHtml = extractHeaderHtml(pageHtml);

    if (!headerHtml) {
      throw new Error("Taylor header module was not found in fetched HTML.");
    }

    return {
      html: sanitizeHeaderHtml(headerHtml),
      styles: extractModuleStyles(pageHtml),
      isFallback: false,
    };
  } catch {
    return {
      html: FALLBACK_HEADER_HTML,
      styles: "",
      isFallback: true,
    };
  }
}
