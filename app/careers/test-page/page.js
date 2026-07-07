export const metadata = {
  title: "Careers Test Page | Taylor Careers",
  description: "Temporary page for testing the Olivia careers chat path rule.",
  alternates: {
    canonical: "/careers/test-page",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CareersTestPage() {
  return (
    <section className="b__size-md">
      <div className="container">
        <div className="c__heading-wrapper mb-3 text-center">
          <h1 className="c__heading u__h1 u__f-700 d-block u__heading-color--primary mb-0">
            Careers Test Page
          </h1>
        </div>
        <div className="c__description-wrapper text-center">
          <p className="mb-0 u__h6">
            Temporary page for testing whether the Olivia chat widget appears
            on a /careers/ path.
          </p>
        </div>
      </div>
    </section>
  );
}
