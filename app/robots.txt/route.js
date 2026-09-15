import { getSiteUrl } from "@/app/lib/jobs";
import { isPreviewSite } from "@/app/lib/preview";

export function GET() {
  const siteUrl = getSiteUrl();

  return new Response(
    isPreviewSite() ? "User-agent: *\nAllow: /\n" : `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
