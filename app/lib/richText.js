export const HIDE_EMPTY_RICHTEXT_PARAGRAPHS = true;

function stripNonContentHtml(value = "") {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;|\u00a0/gi, "")
    .replace(/[\s\u200b\u200c\u200d\ufeff]/g, "");
}

export function formatRichTextHtml(html = "") {
  if (!HIDE_EMPTY_RICHTEXT_PARAGRAPHS) return html;

  return html.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, (paragraph) => {
    return stripNonContentHtml(paragraph) ? paragraph : "";
  });
}
