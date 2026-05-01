import {
  buildJobPath,
  fetchJobs,
  getListingUrl,
  getSiteUrl,
  getTotalPages,
} from "@/app/lib/jobs";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapEntries(jobs) {
  const now = new Date().toISOString();
  const siteUrl = getSiteUrl();
  const totalPages = getTotalPages(jobs.length);

  const listingEntries = Array.from({ length: totalPages }, (_, index) => ({
    url: getListingUrl(index + 1),
    lastModified: now,
    changeFrequency: "daily",
    priority: index === 0 ? 1 : 0.8,
  }));

  const jobEntries = jobs
    .map((job) => buildJobPath(job))
    .filter(Boolean)
    .map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    }));

  return [...listingEntries, ...jobEntries];
}

function buildSitemapXml(entries) {
  const rows = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${escapeXml(entry.lastModified)}</lastmod>
    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>
`;
}

export async function GET() {
  const jobs = await fetchJobs();
  const siteUrl = getSiteUrl();
  const entries = buildSitemapEntries(jobs);
  const xml = buildSitemapXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
