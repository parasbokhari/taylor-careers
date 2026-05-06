const FOOTER_SOURCE_URL = "https://www.taylor.com/";
const FOOTER_MODULE_ID = "module_17194356047198";
const TRACKING_PARAMS = ["__hstc", "__hssc", "__hsfp"];

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

function extractFooterHtml(pageHtml) {
  const wrapperStart = pageHtml.search(
    /<div\b[^>]*data-global-resource-path=["']Taylor II\/templates\/partials\/footer\.html["'][^>]*>/i,
  );

  if (wrapperStart !== -1) {
    return extractBalancedElement(pageHtml, wrapperStart, "div");
  }

  const footerStart = pageHtml.search(
    new RegExp(`<footer\\b[^>]*id=["']${FOOTER_MODULE_ID}["'][^>]*>`, "i"),
  );

  if (footerStart === -1) {
    return null;
  }

  return extractBalancedElement(pageHtml, footerStart, "footer");
}

function extractFooterStyles(pageHtml) {
  const styles = [];
  const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let match;

  while ((match = stylePattern.exec(pageHtml))) {
    const css = match[1].trim();
    if (
      css.includes(FOOTER_MODULE_ID) ||
      css.includes("b__site-footer") ||
      css.includes("b__site-header__global-site-footer")
    ) {
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
    const url = new URL(value, FOOTER_SOURCE_URL);
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

function sanitizeFooterHtml(html) {
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

export async function getTaylorFooter() {
  try {
    const response = await fetch(FOOTER_SOURCE_URL, {
      next: { revalidate: 3600, tags: ["taylor-global-footer"] },
    });

    if (!response.ok) {
      throw new Error(`Taylor footer fetch failed: ${response.status}`);
    }

    const pageHtml = await response.text();
    const footerHtml = extractFooterHtml(pageHtml);

    if (!footerHtml) {
      throw new Error("Taylor footer module was not found in fetched HTML.");
    }

    return {
      html: sanitizeFooterHtml(footerHtml),
      styles: extractFooterStyles(pageHtml),
      isFallback: false,
    };
  } catch {
    return {
      html: "",
      styles: "",
      isFallback: true,
    };
  }
}
