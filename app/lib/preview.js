export function isPreviewSite() {
  return process.env.VERCEL_ENV === "preview" || process.env.PREVIEW_SITE === "true";
}
