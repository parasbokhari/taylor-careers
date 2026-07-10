import { getCategoryPages } from "@/app/lib/categoryContent";
import {
  buildJobPath,
  fetchFreshJobs,
  getListingUrl,
  getSiteUrl,
  getTotalPages,
} from "@/app/lib/jobs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapEntries(jobs) {
  const siteUrl = getSiteUrl();
  const totalPages = getTotalPages(jobs.length);

  const homeEntry = {
    url: `${siteUrl}/`,
    changeFrequency: "daily",
    priority: 1,
  };

  const listingEntries = Array.from({ length: totalPages }, (_, index) => ({
    url: getListingUrl(index + 1),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const jobEntries = jobs
    .map((job) => buildJobPath(job))
    .filter(Boolean)
    .map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const categoryIndexEntry = {
    url: `${siteUrl}/categories`,
    changeFrequency: "daily",
    priority: 0.8,
  };

  const categoryEntries = getCategoryPages()
    .map((category) => `/categories/${category.slug}`)
    .map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  return [
    homeEntry,
    ...listingEntries,
    categoryIndexEntry,
    ...categoryEntries,
    ...jobEntries,
  ];
}

function buildSitemapXml(entries) {
  const rows = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
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
  const jobs = await fetchFreshJobs();
  const entries = buildSitemapEntries(jobs);
  const xml = buildSitemapXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
