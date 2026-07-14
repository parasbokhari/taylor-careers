import { buildSeoMetadata } from "@/app/lib/seo";
import Link from "@/app/components/CustomLink";

export const metadata = buildSeoMetadata({
  title: "Page Not Found | Taylor",
  description: "The requested Taylor Careers page could not be found.",
  path: "/404",
  robots: { index: false },
});

export default function NotFound() {
  return (
    <section className="b__size-md b__error__404">
      <div className="container b__site-header__global-site-header__container">
        <div className="row b__error__404__grid-row align-items-center">
          <div className="col-md-6">
            <div className="b__error__404__content-wrapper position-relative u__z-index-5">
              <h1 className="c__heading u__d1 u__f-900 d-block b__error__404__heading mb-2">
                404
              </h1>
              <h2 className="c__heading u__d2 u__f-700 d-block b__error__404__subheading mb-3">
                Well This is Awkward...
              </h2>
              <p className="u__h5 b__error__404__description">
                Looks like the page you are looking for is out of print!
                Don&apos;t worry, we can get you where you need to go. Here are
                a couple options to make sure you arrive where you want to be.
              </p>
              <div className="c__button-wrapper c__button-wrapper--flex mt-4 pt-2">
                <div className="c__button-wrapper--flex__column c__button-wrapper--flex__column--left">
                  <Link className="c__button__anchor-element" href="/">
                    <span className="c__button c__button--primary c__button--type-squarish c__button--size-xxxlarge">
                      <span className="c__button__content u__f-700">
                        <span>Go Home</span>
                      </span>
                    </span>
                  </Link>
                </div>

                <div className="c__button-wrapper--flex__column c__button-wrapper--flex__column--right">
                  <a
                    className="c__button__anchor-element"
                    href="https://www.taylor.com/contact-us"
                  >
                    <span className="c__button c__button--ghost c__button--type-squarish c__button--size-xxxlarge">
                      <span className="c__button__content u__f-700">
                        <span>Contact Us</span>
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="b__error__404__image-wrapper">
              <figure className="m-0 d-inline">
                <img
                  src="https://www-taylor-com.sandbox.hs-sites.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/404%20Error/NEW%202025/Commercial_Printer_Paper_404_Error-Compiled.webp"
                  alt="Printer Paper 404 Graphic - Taylor.com"
                  loading="lazy"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
