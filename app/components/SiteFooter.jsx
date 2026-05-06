import { getTaylorFooter } from "@/app/lib/taylorFooter";

const currentYear = new Date().getFullYear();

const TAYLOR_LOGO_URL =
  "https://www-taylor-com.sandbox.hs-sites.com/hubfs/_Taylor.com%20-%20All%20file%20connected%20%20to%20main%20site%20and%20blogs/dev/Logo.svg";

const socialLinks = [
  [
    "https://www.linkedin.com/company/taylorcorporation/",
    "Follow Taylor on LinkedIn",
    "https://www-taylor-com.sandbox.hs-sites.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/6.%20Footer/LinkedIn-Icon.svg",
    "LinkedIn-Icon",
  ],
  [
    "https://www.youtube.com/@TaylorCorporation",
    "Follow Taylor on YouTube",
    "https://www-taylor-com.sandbox.hs-sites.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/6.%20Footer/YouTube-Icon.svg",
    "YouTube-Icon",
  ],
  [
    "https://www.instagram.com/taylorcorporation",
    "Follow Taylor on Instagram",
    "https://www-taylor-com.sandbox.hs-sites.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/6.%20Footer/Instagram-Icon.svg",
    "Instagram-Icon",
  ],
  [
    "https://www.facebook.com/TaylorCorporation",
    "Follow Taylor on Facebook",
    "https://www-taylor-com.sandbox.hs-sites.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/6.%20Footer/Facebook-Icon.svg",
    "Facebook-Icon",
  ],
  [
    "https://www.tiktok.com/@taylorcorporation",
    "Follow Taylor on Tiktok",
    "https://www-taylor-com.sandbox.hs-sites.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/6.%20Footer/TikTok-Icon.svg",
    "TikTok-Icon",
  ],
  [
    "https://twitter.com/TaylorCorp",
    "Follow Taylor on X",
    "https://www-taylor-com.sandbox.hs-sites.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/6.%20Footer/X-Icon.svg",
    "X-Icon",
  ],
];

const resourceLinks = [
  ["Blog", "https://www.taylor.com/blog"],
  ["Case Studies", "https://www.taylor.com/case-study"],
  ["Research Studies", "https://www.taylor.com/research"],
  ["Videos", "https://www.taylor.com/video"],
  ["Podcasts", "https://www.taylor.com/podcast"],
];

const companyLinks = [
  ["About", "https://www.taylor.com/about-us"],
  ["Careers", "https://www.taylor.com/careers", "Now Hiring"],
  [
    "Customer Advocacy Program",
    "https://www.taylor.com/customer-advocacy-program",
  ],
  ["Locations", "https://www.taylor.com/locations"],
  ["Suppliers", "https://www.taylor.com/suppliers"],
  ["Sustainability", "https://www.taylor.com/sustainability"],
];

const legalLinks = [
  ["Privacy Policy", "https://www.taylor.com/privacy-policy"],
  ["Terms of Use", "https://www.taylor.com/terms-of-use"],
  ["Accessibility", "https://www.taylor.com/accessibility"],
];

function MenuWrapper({ children }) {
  return (
    <span
      id="hs_cos_wrapper_module_17194356047198_"
      className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_simple_menu"
      data-hs-cos-general-type="widget"
      data-hs-cos-type="simple_menu"
    >
      <div
        id="hs_menu_wrapper_module_17194356047198_"
        className="hs-menu-wrapper active-branch flyouts hs-menu-flow-horizontal"
        role="navigation"
        data-sitemap-name=""
        data-menu-id=""
        aria-label="Navigation Menu"
      >
        {children}
      </div>
    </span>
  );
}

function MenuList({ links }) {
  return (
    <MenuWrapper>
      <ul role="menu">
        {links.map(([label, href, badge]) => (
          <li className="hs-menu-item hs-menu-depth-1" key={label} role="none">
            <a href={href} role="menuitem" target="_self">
              {label}
              {badge ? <span className="c__badge"> {badge}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </MenuWrapper>
  );
}

function SimpleMenu({ links }) {
  return (
    <div className="c__simple-menu">
      <MenuList links={links} />
    </div>
  );
}

function FlexMenu({ links }) {
  return (
    <div className="c__flex-menu">
      <MenuList links={links} />
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="b__site-footer__global-site-footer__branding__social-wrapper mt-4 ms-0 pt-1 pt-lg-0">
      <div className="c__post__social-share u__bg-white p-0">
        <div className="c__post__social-share__row justify-content-start">
          {socialLinks.map(([href, helpText, iconSrc, iconAlt]) => (
            <div className="c__post__social-share__col" key={helpText}>
              <a
                href={href}
                target="_blank"
                title={helpText}
                aria-label={helpText}
              >
                <span className="visually-hidden">{helpText}</span>
                <div className="c__post__social-share__figure-wrapper">
                  <figure className="d-inline">
                    <img
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "contain",
                      }}
                      src={iconSrc}
                      alt={iconAlt}
                      loading="lazy"
                    />
                  </figure>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactContent() {
  return (
    <div className="c__richtext-field">
      <p>
        <a
          className="u__inline-anchor-with-inherited-color"
          href="https://maps.app.goo.gl/12528SQzmWFDPvcw7"
          target="_blank"
          rel="noopener"
        >
          1725 Roe Crest Drive <br />
          North Mankato, MN 56003
        </a>
      </p>
      <p>
        <a
          className="u__inline-anchor-with-inherited-color"
          href="mailto:communications@taylor.com"
        >
          communications@taylor.com
        </a>
      </p>
      <p>
        <a
          className="u__inherited-anchor u__anchor-color--hover u__text-decoration-underline--hover"
          href="tel:1-800-631-7644"
        >
          1-800-631-7644
        </a>
      </p>
    </div>
  );
}

function SearchFooter() {
  return (
    <div className="b__site-footer__global-site-footer__newsletter">
      <div className="b__site-footer__global-site-footer__heading-wrapper mb-3">
        <span className="u__heading-color--primary u__p u__f-900">
          Search Taylor
        </span>
      </div>
      <div className="c__form">
        <form
          className="c__search-form-footer"
          action="https://www.taylor.com/hs-search-results"
        >
          <div>
            <input
              type="search"
              placeholder="Search taylor.com"
              aria-label="Search"
              aria-describedby="c__search-form-footer__button-wrapper"
              autoComplete="off"
              name="term"
              className="c__search-form-footer__input"
              required
            />
            <div className="mt-3">
              <button
                className="c__search-form-footer__button c__button c__button--primary w-100"
                type="submit"
              >
                <span className="c__button__content u__f-700">
                  <span>Search</span>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function FallbackSiteFooter() {
  return (
    <footer id="module_17194356047198" className="module_17194356047198">
      <div className="b__site-footer__global-site-footer">
        <div className="b__site-footer__global-site-footer__main">
          <div className="container b__site-header__global-site-footer__container">
            <div className="row b__site-footer__global-site-footer__grid-row-one">
              <div className="col-lg-3">
                <div className="b__site-footer__global-site-footer__branding">
                  <div className="b__site-footer__global-site-footer__branding__logo-wrapper">
                    <figure className="m-0 d-inline">
                      <img
                        src={TAYLOR_LOGO_URL}
                        alt="Logo - Taylor Corporation"
                        loading="lazy"
                      />
                    </figure>
                  </div>
                  <div className="b__site-footer__global-site-footer__branding__heading-wrapper mt-4">
                    <span className="u__h5 u__f-900 u__heading-color--primary">
                      Ready to power your <br />
                      brand&apos;s potential?
                    </span>
                  </div>
                  <div className="b__site-footer__global-site-footer__branding__title-wrapper mt-4">
                    <span className="u__h5 u__f-400">Let&apos;s Connect.</span>
                  </div>
                  <SocialLinks />
                </div>
              </div>
              <nav className="col-lg-9">
                <div className="row b__site-footer__global-site-footer__grid-row-two">
                  <div className="col-md-6 col-lg-3 b__site-footer__global-site-footer__col b__site-footer__global-site-footer__col--contact">
                    <div className="b__site-footer__global-site-footer__contact">
                      <div className="b__site-footer__global-site-footer__heading-wrapper mb-3">
                        <span className="u__heading-color--primary u__p u__f-900">
                          Contact
                        </span>
                      </div>
                      <ContactContent />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 b__site-footer__global-site-footer__col b__site-footer__global-site-footer__col--simple-menu b__site-footer__global-site-footer__col--simple-menu--left">
                    <div className="b__site-footer__global-site-footer__simple-menu">
                      <div className="b__site-footer__global-site-footer__heading-wrapper mb-3">
                        <span className="u__heading-color--primary u__p u__f-900">
                          Resources
                        </span>
                      </div>
                      <SimpleMenu links={resourceLinks} />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 b__site-footer__global-site-footer__col b__site-footer__global-site-footer__col--simple-menu b__site-footer__global-site-footer__col--simple-menu--right">
                    <div className="b__site-footer__global-site-footer__simple-menu">
                      <div className="b__site-footer__global-site-footer__heading-wrapper mb-3">
                        <span className="u__heading-color--primary u__p u__f-900">
                          Company
                        </span>
                      </div>
                      <SimpleMenu links={companyLinks} />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 b__site-footer__global-site-footer__col b__site-footer__global-site-footer__col--newsletter">
                    <SearchFooter />
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="container b__site-header__global-site-footer__container">
          <hr className="b__site-footer__global-site-footer__border-separator" />
        </div>
        <div className="b__site-footer__global-site-footer__bottom">
          <div className="container b__site-header__global-site-footer__container">
            <div className="row b__site-footer__global-site-footer__grid-row-three align-items-center">
              <div className="col-md-6">
                <div className="text-center text-md-start">
                  <span>
                    © {currentYear} Taylor Corporation. All Rights Reserved.
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <FlexMenu links={legalLinks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default async function SiteFooter() {
  const footer = await getTaylorFooter();

  if (footer.isFallback) {
    return <FallbackSiteFooter />;
  }

  return (
    <>
      {footer.styles ? (
        <style dangerouslySetInnerHTML={{ __html: footer.styles }} />
      ) : null}
      <div
        data-taylor-footer-source="hubspot"
        dangerouslySetInnerHTML={{ __html: footer.html }}
      />
    </>
  );
}
