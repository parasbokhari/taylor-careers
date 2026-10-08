"use client";

import { useEffect } from "react";

function getFocusableElements(element) {
  return Array.from(
    element.querySelectorAll(
      'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((item) => !item.hasAttribute("disabled"));
}

function trapFocus(element, previousElement = document.activeElement, initialFocus) {
  const focusableElements = getFocusableElements(element);
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  if (!firstFocusableElement || !lastFocusableElement) {
    return { onClose: () => previousElement?.focus?.() };
  }

  (initialFocus || firstFocusableElement).focus();

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

function getMobileFocusableElements(element) {
  return Array.from(
    element.querySelectorAll(
      'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((item) => {
    const style = window.getComputedStyle(item);
    return (
      item.tabIndex >= 0 &&
      !item.matches(":disabled") &&
      !item.closest('[inert], [hidden], [aria-hidden="true"]') &&
      item.getClientRects().length > 0 &&
      style.visibility !== "hidden" &&
      style.visibility !== "collapse"
    );
  });
}

function trapMobileFocus(element, previousElement = document.activeElement, initialFocus, trigger) {
  // Recalculate after every disclosure change so collapsed links are skipped.
  const getElements = () => [
    ...(trigger ? [trigger] : []),
    ...getMobileFocusableElements(element),
  ];
  const focusFirst = () => (getElements()[0] || element).focus();
  (initialFocus || getElements()[0] || element).focus();

  function handleKeydown(event) {
    if (event.key !== "Tab") {
      return;
    }

    const elements = getElements();
    const index = elements.indexOf(document.activeElement);
    event.preventDefault();
    if (!elements.length) return focusFirst();
    const nextIndex = index === -1
      ? (event.shiftKey ? elements.length - 1 : 0)
      : (index + (event.shiftKey ? -1 : 1) + elements.length) % elements.length;
    elements[nextIndex].focus();
  }

  function handleFocusin(event) {
    if (!element.contains(event.target) && event.target !== trigger) {
      focusFirst();
    }
  }

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("focusin", handleFocusin);

  return {
    onClose(restoreFocus = true) {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("focusin", handleFocusin);
      if (restoreFocus) previousElement?.focus?.();
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
    let searchFocusTimeout = null;
    let trappedMobileFocus = null;

    if (!canvas) {
      return undefined;
    }

    const mobileBoard = canvas.querySelector(
      "#b__site-header__global-site-header__navigation-board",
    );
    const hamburger = canvas.querySelector(".c__hamburger");
    const submenuSelector = ".b__site-header__global-site-header__anchor-wrapper__chev-handler";
    const activeSubmenuClass = "b__site-header__global-site-header__list-level--active";

    function setMobileSubmenu(listItem, isOpen) {
      const nestedList = listItem.querySelector(
        ":scope > .b__site-header__global-site-header__list-level-nested",
      );
      if (!nestedList) return;

      listItem.classList.toggle(activeSubmenuClass, isOpen);
      nestedList.style.display = isOpen ? "block" : "none";
      nestedList.inert = !isOpen;
      nestedList.setAttribute("aria-hidden", String(!isOpen));
      listItem.querySelector(`:scope > div ${submenuSelector}`)
        ?.setAttribute("aria-expanded", String(isOpen));
      const anchor = listItem.querySelector(":scope > div > a");
      if (anchor?.getAttribute("href") === "#") {
        anchor.setAttribute("aria-expanded", String(isOpen));
      }
    }

    if (mobileBoard && hamburger) {
      mobileBoard.inert = true;
      mobileBoard.setAttribute("aria-hidden", "true");
      mobileBoard.tabIndex = -1;
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open navigation menu");
      hamburger.setAttribute("aria-controls", mobileBoard.id);

      // This is website navigation with disclosures, not an ARIA application menu.
      mobileBoard.querySelectorAll('[role="menu"], [role="menuitem"]')
        .forEach((item) => item.removeAttribute("role"));
      mobileBoard.querySelectorAll(submenuSelector).forEach((handler, index) => {
        const listItem = handler.closest("li");
        const anchor = listItem?.querySelector(":scope > div > a");
        const nestedList = listItem?.querySelector(
          ":scope > .b__site-header__global-site-header__list-level-nested",
        );
        if (!anchor || !nestedList) return;

        const button = handler.tagName === "BUTTON" ? handler : document.createElement("button");
        if (button !== handler) {
          button.className = handler.className;
          handler.replaceWith(button);
        }
        button.type = "button";
        // Some imported arrows otherwise position their control over the whole row.
        button.parentElement.classList.add("position-relative");
        nestedList.id ||= `${mobileBoard.id}-submenu-${index}`;
        button.setAttribute("aria-label", `${anchor.textContent.replace(/\s+/g, " ").trim()} submenu`);
        button.setAttribute("aria-controls", nestedList.id);
        anchor.removeAttribute("aria-haspopup");
        if (anchor.getAttribute("href") === "#") {
          anchor.setAttribute("role", "button");
          anchor.setAttribute("aria-controls", nestedList.id);
          // The named chevron button is the keyboard control for placeholder labels.
          anchor.tabIndex = -1;
        } else {
          anchor.removeAttribute("aria-expanded");
        }
        setMobileSubmenu(listItem, false);
      });
    }

    function openSearch(trigger) {
      closeMobileNav(false);
      html.classList.add("search-board--active");
      canvas
        .querySelectorAll(".b__site-header__global-site-header__search-button")
        .forEach((button) => button.setAttribute("aria-expanded", "true"));
      searchBoard?.setAttribute("aria-hidden", "false");

      searchFocusTimeout = window.setTimeout(() => {
        if (searchBoard) {
          trappedSearchFocus = trapFocus(
            searchBoard,
            trigger,
            searchBoard.querySelector('input[type="search"], input[type="text"]'),
          );
        }
      }, 300);
    }

    function closeSearch() {
      window.clearTimeout(searchFocusTimeout);
      html.classList.remove("search-board--active");
      canvas
        .querySelectorAll(".b__site-header__global-site-header__search-button")
        .forEach((button) => button.setAttribute("aria-expanded", "false"));
      searchBoard?.setAttribute("aria-hidden", "true");
      trappedSearchFocus?.onClose();
      trappedSearchFocus = null;
    }

    function closeMobileNav(restoreFocus = true) {
      trappedMobileFocus?.onClose(restoreFocus);
      trappedMobileFocus = null;
      hamburger?.classList.remove("c__hamburger--active");
      html.classList.remove("ham-navigation-board--active");
      hamburger?.setAttribute("aria-expanded", "false");
      hamburger?.setAttribute("aria-label", "Open navigation menu");
      if (mobileBoard) {
        mobileBoard.inert = true;
        mobileBoard.setAttribute("aria-hidden", "true");
      }
    }

    function toggleMobileNav() {
      if (!mobileBoard || !hamburger) return;
      if (trappedMobileFocus) return closeMobileNav();

      closeSearch();
      hamburger.classList.add("c__hamburger--active");
      html.classList.add("ham-navigation-board--active");
      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute("aria-label", "Close navigation menu");
      mobileBoard.inert = false;
      mobileBoard.setAttribute("aria-hidden", "false");
      trappedMobileFocus = trapMobileFocus(
        mobileBoard, hamburger, getMobileFocusableElements(mobileBoard)[0], hamburger,
      );
    }

    function handleResize() {
      if (trappedMobileFocus && !getMobileFocusableElements(canvas).includes(hamburger)) {
        const focusWasInMenu = mobileBoard.contains(document.activeElement);
        closeMobileNav(false);
        if (focusWasInMenu) getMobileFocusableElements(canvas)[0]?.focus();
      }
    }

    function handleMobileSubmenu(handler) {
      const listItem = handler.closest("li");
      const nestedList = listItem?.querySelector(
        ":scope > .b__site-header__global-site-header__list-level-nested",
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

        setMobileSubmenu(sibling, false);
      });

      setMobileSubmenu(listItem, shouldOpen);
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
        toggleMobileNav();
      } else if (mobileSubmenuHandler) {
        event.preventDefault();
        handleMobileSubmenu(mobileSubmenuHandler);
      } else if (placeholderLink && canvas.contains(placeholderLink)) {
        event.preventDefault();
        if (mobileBoard?.contains(placeholderLink)) {
          const handler = placeholderLink.parentElement.querySelector(submenuSelector);
          if (handler) handleMobileSubmenu(handler);
        }
      }

      if (!event.target.closest(".b__site-header__global-site-header")) {
        closeDesktopSubmenus(canvas);
      }
    }

    function handleKeydown(event) {
      const activeElement = document.activeElement;

      if (event.key === "Escape") {
        if (trappedMobileFocus) {
          event.preventDefault();
          closeMobileNav();
        } else {
          closeSearch();
        }
        closeDesktopSubmenus(canvas);
        return;
      }

      if (
        (event.key === "Enter" || event.key === " ") &&
        mobileBoard?.contains(activeElement) &&
        activeElement?.matches('a[role="button"][href="#"]')
      ) {
        event.preventDefault();
        if (!event.repeat) activeElement.click();
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
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mouseover", handleMouseover);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(searchFocusTimeout);
      html.classList.remove("search-board--active", "ham-navigation-board--active");
      trappedSearchFocus?.onClose();
      closeMobileNav(false);
    };
  }, []);

  return null;
}
