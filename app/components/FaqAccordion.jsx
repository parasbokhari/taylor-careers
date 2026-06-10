"use client";

import { useState } from "react";

function PlusIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="#A8A9AB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="#A8A9AB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isHtml(value) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function FaqAnswer({ answer }) {
  if (isHtml(answer)) {
    return <div dangerouslySetInnerHTML={{ __html: answer }} />;
  }

  return <p>{answer}</p>;
}

export default function FaqAccordion({ faqs, moduleId = "category-faqs" }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs?.length) return null;

  function toggleFaq(index) {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  }

  function handleHeaderKeyDown(event, index) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    toggleFaq(index);
  }

  return (
    <div className="b__faq__faqs-with-content__faq-list-wrapper">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const accordionId = `accordion-${moduleId}-${index + 1}`;
        const isLast = index === faqs.length - 1;

        return (
          <div
            className={`c__accordion c__accordion--var-02${
              isLast ? "" : " c__accordion--var-02--border-bottom"
            }`}
            key={`${faq.question}-${index}`}
          >
            <div
              tabIndex="0"
              aria-expanded={isOpen}
              role="button"
              aria-controls={accordionId}
              className="c__accordion__header-wrapper"
              onClick={() => toggleFaq(index)}
              onKeyDown={(event) => handleHeaderKeyDown(event, index)}
            >
              <div className="c__accordion__heading-wrapper">
                <h3 className="c__accordion__heading u__h5 u__f-400 mb-0">
                  {faq.question}
                </h3>
              </div>
              <div className="c__accordion__figure-wrapper">
                <div
                  className="c__accordion__figure-wrapper__plus"
                  style={{ display: isOpen ? "none" : undefined }}
                >
                  <figure className="m-0">
                    <PlusIcon />
                  </figure>
                </div>
                <div
                  className="c__accordion__figure-wrapper__minus"
                  style={{ display: isOpen ? undefined : "none" }}
                >
                  <figure className="m-0">
                    <MinusIcon />
                  </figure>
                </div>
              </div>
            </div>

            <div
              id={accordionId}
              aria-hidden={!isOpen}
              className="c__accordion__body-wrapper"
              style={{ display: isOpen ? undefined : "none" }}
            >
              <div className="c__richtext-field">
                <FaqAnswer answer={faq.answer} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
