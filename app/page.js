import { buildSeoMetadata } from "@/app/lib/seo";

export const metadata = buildSeoMetadata({
  title: "Taylor Careers",
  description: "Explore careers at Taylor.",
  path: "/",
});

export default function HomePage() {
  return null;
}
