import { getSiteUrl } from "@/app/lib/jobs";

export function GET() {
  const siteUrl = getSiteUrl();

  return new Response(
    `User-agent: *
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
