import "./index.scss";
import { getSiteUrl } from "@/app/lib/jobs";

export const metadata = {
  title: "Careers | Taylor",
  description: "Explore open positions at Taylor.",
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
