import { getSiteUrl } from "@/app/lib/jobs";

function buildStylesheet(siteUrl) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>XML Sitemap</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #1f2937;
            background: linear-gradient(180deg, #f8fbff 0%, #ffffff 45%);
          }
          .wrap {
            max-width: 1080px;
            margin: 0 auto;
            padding: 40px 20px 64px;
          }
          .hero {
            background: #ffffff;
            border: 1px solid #dbe7ff;
            border-radius: 18px;
            padding: 24px 28px;
          }
          h1 {
            margin: 0 0 10px;
            font-size: 32px;
            line-height: 1.1;
          }
          p {
            margin: 0;
            line-height: 1.6;
            color: #4b5563;
          }
          .meta {
            margin-top: 14px;
            font-size: 14px;
            color: #2458f1;
            font-weight: 700;
          }
          .table-wrap {
            margin-top: 24px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            overflow: hidden;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 14px 18px;
            text-align: left;
            border-bottom: 1px solid #eef2f7;
            font-size: 14px;
            vertical-align: top;
          }
          th {
            background: #f8fafc;
            color: #111827;
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          tr:last-child td {
            border-bottom: none;
          }
          a {
            color: #2458f1;
            text-decoration: none;
            word-break: break-word;
          }
          a:hover {
            text-decoration: underline;
          }
          .footer {
            margin-top: 16px;
            font-size: 13px;
            color: #6b7280;
          }
          @media (max-width: 720px) {
            .wrap {
              padding: 20px 14px 40px;
            }
            .hero, .table-wrap {
              border-radius: 14px;
            }
            th, td {
              padding: 12px;
            }
            h1 {
              font-size: 26px;
            }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="hero">
            <h1>XML Sitemap</h1>
            <p>
              This sitemap is used by search engines to help crawl the site more
              efficiently. It also includes a readable view for humans.
            </p>
            <div class="meta">
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)" /> URLs
              · <xsl:text> </xsl:text>
              <a href="${siteUrl}">${siteUrl}</a>
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Last Modified</th>
                  <th>Change Frequency</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a>
                        <xsl:attribute name="href">
                          <xsl:value-of select="sitemap:loc" />
                        </xsl:attribute>
                        <xsl:value-of select="sitemap:loc" />
                      </a>
                    </td>
                    <td><xsl:value-of select="sitemap:lastmod" /></td>
                    <td><xsl:value-of select="sitemap:changefreq" /></td>
                    <td><xsl:value-of select="sitemap:priority" /></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <div class="footer">
            Generated automatically by Taylor Careers.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;
}

export async function GET() {
  return new Response(buildStylesheet(getSiteUrl()), {
    headers: {
      "Content-Type": "text/xsl; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
