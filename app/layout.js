import "./index.scss";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { getSiteUrl } from "@/app/lib/jobs";

export const metadata = {
  title: "Careers | Taylor",
  description: "Explore open positions at Taylor.",
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
