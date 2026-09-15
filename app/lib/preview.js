export function isPreviewSite() {
  return process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_TARGET_ENV === "staging" ||
    process.env.VERCEL_GIT_COMMIT_REF === "staging" ||
    process.env.PREVIEW_SITE === "true";
}
