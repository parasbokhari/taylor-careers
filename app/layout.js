import "./index.scss";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { getSiteUrl } from "@/app/lib/jobs";
import { buildSeoMetadata } from "@/app/lib/seo";
import { Lato } from "next/font/google";

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
});

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
    <html lang="en" className={lato.variable}>
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
