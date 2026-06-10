import "./index.scss";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { getSiteUrl } from "@/app/lib/jobs";
import { buildSeoMetadata } from "@/app/lib/seo";

export const metadata = {
  ...buildSeoMetadata({
    title: "Careers | Taylor",
    description: "Explore careers and open positions at Taylor.",
    path: "/",
  }),
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main id="main-content" className="overflow-hidden">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
