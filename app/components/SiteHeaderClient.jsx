"use client";

import { useEffect } from "react";

function getFocusableElements(element) {
  return Array.from(
    element.querySelectorAll(
      'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((item) => !item.hasAttribute("disabled"));
}

function trapFocus(element, previousElement = document.activeElement) {
  const focusableElements = getFocusableElements(element);
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  if (!firstFocusableElement || !lastFocusableElement) {
    return { onClose: () => previousElement?.focus?.() };
  }

  firstFocusableElement.focus();

  function handleKeydown(event) {
    if (event.key !== "Tab") {
      return;
    }

    if (event.shiftKey && document.activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  }

  document.addEventListener("keydown", handleKeydown);

  return {
    onClose() {
      document.removeEventListener("keydown", handleKeydown);
      previousElement?.focus?.();
    },
  };
}

function setVisible(element, isVisible, hiddenValue = !isVisible) {
  if (!element) {
    return;
  }

  element.style.display = isVisible ? "" : "none";
  element.setAttribute("aria-hidden", hiddenValue ? "true" : "false");
}

function switchMenusOnHover(canvas, element) {
  const currentMegaBoard = element.closest(
    ".b__site-header__global-site-header__mega-board",
  );
  const target = element.getAttribute("data-target")?.trim();

  if (!currentMegaBoard || !target) {
    return;
  }

  resetNestedMenuState(currentMegaBoard);

  currentMegaBoard
    .querySelectorAll(
      ".b__site-header__global-site-header__child-navigation-item",
    )
    .forEach((item) =>
      item.classList.remove(
        "b__site-header__global-site-header__child-navigation-item--active",
      ),
    );

  currentMegaBoard
    .querySelectorAll(
      ".b__site-header__global-site-header__child-navigation-item__tab-switcher",
    )
    .forEach((item) => item.setAttribute("aria-expanded", "false"));

  element
    .closest(".b__site-header__global-site-header__child-navigation-item")
    ?.classList.add(
      "b__site-header__global-site-header__child-navigation-item--active",
    );

  element.setAttribute("aria-expanded", "true");

  currentMegaBoard
    .querySelectorAll(
      ".b__site-header__global-site-header__mega-board__content-wrapper--right",
    )
    .forEach((item) => setVisible(item, false));

  setVisible(canvas.querySelector(`#${CSS.escape(target)}`), true);
  setVisible(canvas.querySelector(`#${CSS.escape(`${target}--featured`)}`), true, true);
}

function resetNestedMenuState(parent) {
  parent
    .querySelectorAll(
      ".b__site-header__global-site-header__grand-child-navigation-item__tab-switcher",
    )
    .forEach((item) => {
      item.classList.remove(
        "b__site-header__global-site-header__grand-child-navigation-item__tab-switcher--active",
      );
      item.setAttribute("aria-expanded", "false");
    });

  parent
    .querySelectorAll(
      ".b__site-header__global-site-header__mega-board__inner-col--center",
    )
    .forEach((item) => setVisible(item, false));

  parent.classList.remove(
    "b__site-header__global-site-header__mega-board--variant-two-levels--third-level-expanded",
  );
}

function switchNestedMenusOnHover(canvas, element) {
  const target = element.getAttribute("data-target")?.trim();
  const parent = element.closest(
    ".b__site-header__global-site-header__mega-board--variant-two-levels",
  );

  if (!target || !parent) {
    return;
  }

  resetNestedMenuState(canvas);

  element.classList.add(
    "b__site-header__global-site-header__grand-child-navigation-item__tab-switcher--active",
  );
  element.setAttribute("aria-expanded", "true");

  parent
    .querySelectorAll(
      ".b__site-header__global-site-header__mega-board__inner-col--center",
    )
    .forEach((item) => setVisible(item, false));

  parent.classList.add(
    "b__site-header__global-site-header__mega-board--variant-two-levels--third-level-expanded",
  );
  setVisible(parent.querySelector(`#${CSS.escape(target)}`), true);
}

function closeDesktopSubmenus(canvas) {
  canvas
    .querySelectorAll(
      ".b__site-header__global-site-header__list-level-0__list-item--has-children",
    )
    .forEach((item) => {
      item.classList.remove("u__open-submenu");
      item.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
      resetNestedMenuState(item);
    });
}

export default function SiteHeaderClient() {
  useEffect(() => {
    const canvas = document.querySelector(".b__site-header__global-site-header");
    const html = document.documentElement;
    const searchBoard = document.querySelector(
      "#b__site-header__global-site-header__search-board",
    );
    let trappedSearchFocus = null;

    if (!canvas) {
      return undefined;
    }

    function openSearch(trigger) {
      html.classList.add("search-board--active");
      canvas
        .querySelectorAll(".b__site-header__global-site-header__search-button")
        .forEach((button) => button.setAttribute("aria-expanded", "true"));
      searchBoard?.setAttribute("aria-hidden", "false");

      window.setTimeout(() => {
        if (searchBoard) {
          trappedSearchFocus = trapFocus(searchBoard, trigger);
        }
      }, 300);
    }

    function closeSearch() {
      html.classList.remove("search-board--active");
      canvas
        .querySelectorAll(".b__site-header__global-site-header__search-button")
        .forEach((button) => button.setAttribute("aria-expanded", "false"));
      searchBoard?.setAttribute("aria-hidden", "true");
      trappedSearchFocus?.onClose();
      trappedSearchFocus = null;
    }

    function toggleMobileNav(button) {
      const isOpen = !button.classList.contains("c__hamburger--active");
      const board = document.querySelector(
        "#b__site-header__global-site-header__navigation-board",
      );

      button.classList.toggle("c__hamburger--active", isOpen);
      html.classList.toggle("ham-navigation-board--active", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      board?.setAttribute("aria-hidden", String(!isOpen));
    }

    function handleMobileSubmenu(handler) {
      const listItem = handler.closest("li");
      const nestedList = listItem?.querySelector(
        ":scope > .b__site-header__global-site-header__list-level-nested",
      );
      const anchor = listItem?.querySelector(
        ":scope > .b__site-header__global-site-header__anchor-wrapper > a",
      );
      const shouldOpen = !listItem?.classList.contains(
        "b__site-header__global-site-header__list-level--active",
      );

      if (!listItem || !nestedList) {
        return;
      }

      Array.from(listItem.parentElement?.children || []).forEach((sibling) => {
        if (sibling === listItem) {
          return;
        }

        sibling.classList.remove(
          "b__site-header__global-site-header__list-level--active",
        );
        sibling
          .querySelector(
            ":scope > .b__site-header__global-site-header__list-level-nested",
          )
          ?.setAttribute("style", "display: none");
        sibling
          .querySelector(
            ":scope > .b__site-header__global-site-header__anchor-wrapper > a",
          )
          ?.setAttribute("aria-expanded", "false");
      });

      listItem.classList.toggle(
        "b__site-header__global-site-header__list-level--active",
        shouldOpen,
      );
      nestedList.style.display = shouldOpen ? "block" : "none";
      anchor?.setAttribute("aria-expanded", String(shouldOpen));
    }

    function handleMouseover(event) {
      const childSwitcher = event.target.closest(
        ".b__site-header__global-site-header__child-navigation-item__tab-switcher",
      );
      const grandChildSwitcher = event.target.closest(
        ".b__site-header__global-site-header__grand-child-navigation-item__tab-switcher",
      );
      const levelTwoPlainLink = event.target.closest(
        ".b__site-header__global-site-header__list-level-2__list-item a:not(.b__site-header__global-site-header__grand-child-navigation-item__tab-switcher)",
      );
      const topLevelItem = event.target.closest(
        ".b__site-header__global-site-header__list-level-0__list-item--has-children",
      );

      if (childSwitcher) {
        switchMenusOnHover(canvas, childSwitcher);
      }

      if (grandChildSwitcher) {
        switchNestedMenusOnHover(canvas, grandChildSwitcher);
      }

      if (levelTwoPlainLink) {
        const parent = levelTwoPlainLink.closest(
          ".b__site-header__global-site-header__mega-board--variant-two-levels",
        );

        if (
          parent?.classList.contains(
            "b__site-header__global-site-header__mega-board--variant-two-levels--third-level-expanded",
          )
        ) {
          resetNestedMenuState(parent);
        }
      }

      if (
        topLevelItem &&
        canvas.contains(topLevelItem) &&
        !topLevelItem.contains(event.relatedTarget)
      ) {
        const firstChildSwitcher = topLevelItem.querySelector(
          ".b__site-header__global-site-header__child-navigation-item__tab-switcher",
        );

        if (firstChildSwitcher) {
          switchMenusOnHover(canvas, firstChildSwitcher);
        }
      }
    }

    function handleClick(event) {
      const searchTrigger = event.target.closest(
        ".b__site-header__global-site-header__search-button",
      );
      const closeSearchTrigger = event.target.closest(
        ".b__site-header__global-site-header__search-board__close-trigger",
      );
      const hamburger = event.target.closest(".c__hamburger");
      const mobileSubmenuHandler = event.target.closest(
        ".b__site-header__global-site-header__anchor-wrapper__chev-handler",
      );
      const placeholderLink = event.target.closest('a[href="#"]');

      if (searchTrigger) {
        event.preventDefault();
        openSearch(searchTrigger);
      } else if (closeSearchTrigger) {
        event.preventDefault();
        closeSearch();
      } else if (hamburger) {
        event.preventDefault();
        toggleMobileNav(hamburger);
      } else if (mobileSubmenuHandler) {
        event.preventDefault();
        handleMobileSubmenu(mobileSubmenuHandler);
      } else if (placeholderLink && canvas.contains(placeholderLink)) {
        event.preventDefault();
      }

      if (!event.target.closest(".b__site-header__global-site-header")) {
        closeDesktopSubmenus(canvas);
      }
    }

    function handleKeydown(event) {
      const activeElement = document.activeElement;

      if (event.key === "Escape") {
        closeSearch();
        closeDesktopSubmenus(canvas);
        return;
      }

      if (event.key !== "Enter") {
        return;
      }

      if (
        activeElement?.matches(
          ".b__site-header__global-site-header__navigation-wrapper--large .b__site-header__global-site-header__list-level-0__list-item--has-children > a",
        )
      ) {
        const parent = activeElement.parentElement;
        const shouldOpen = !parent.classList.contains("u__open-submenu");

        event.preventDefault();
        closeDesktopSubmenus(canvas);
        parent.classList.toggle("u__open-submenu", shouldOpen);
        activeElement.setAttribute("aria-expanded", String(shouldOpen));

        const firstChildSwitcher = parent.querySelector(
          ".b__site-header__global-site-header__child-navigation-item__tab-switcher",
        );

        if (firstChildSwitcher) {
          switchMenusOnHover(canvas, firstChildSwitcher);
        }
      } else if (
        activeElement?.classList.contains(
          "b__site-header__global-site-header__child-navigation-item__tab-switcher",
        )
      ) {
        event.preventDefault();
        switchMenusOnHover(canvas, activeElement);
      } else if (
        activeElement?.classList.contains(
          "b__site-header__global-site-header__grand-child-navigation-item__tab-switcher",
        )
      ) {
        event.preventDefault();
        switchNestedMenusOnHover(canvas, activeElement);
      }
    }

    document.addEventListener("mouseover", handleMouseover);
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("mouseover", handleMouseover);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeydown);
      html.classList.remove("search-board--active", "ham-navigation-board--active");
      trappedSearchFocus?.onClose();
    };
  }, []);

  return null;
}
