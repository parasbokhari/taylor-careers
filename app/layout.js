import "./index.scss";

export const metadata = {
  title: "Careers | Taylor",
  description: "Explore open positions at Taylor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
