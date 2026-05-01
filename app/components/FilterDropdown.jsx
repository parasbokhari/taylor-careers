'use client';

import { useState, useRef, useEffect, useCallback } from "react";

const SEE_MORE_THRESHOLD = 5;

export default function FilterDropdown({
  filterDef,
  selected,
  onToggle,
  isOpen,
  onOpen,
  onClose,
}) {
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef(null);

  const handleOpen = useCallback(() => {
    if (isOpen) {
      setExpanded(false);
      onClose();
      return;
    }
    onOpen();
  }, [isOpen, onClose, onOpen]);

  const handleClose = useCallback(() => {
    setExpanded(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        handleClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [handleClose, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleClose, isOpen]);

  const hasActive = selected.length > 0;
  const hasMore = filterDef.options.length > SEE_MORE_THRESHOLD;
  const visibleOpts = expanded
    ? filterDef.options
    : filterDef.options.slice(0, SEE_MORE_THRESHOLD);
  const hiddenCount = filterDef.options.length - SEE_MORE_THRESHOLD;

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        type="button"
        className={`c__filter-item${hasActive ? " c__filter-item--active" : ""}`}
        onClick={handleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
      >
        <div className="c__filter-item__label-wrapper">
          <span className="c__filter-item__label">{filterDef.label}</span>
          {hasActive && (
            <span
              className="c__filter-item__count-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#2458F1",
                color: "#fff",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "11px",
                fontWeight: "700",
                lineHeight: 1,
                marginLeft: "5px",
              }}
            >
              {selected.length}
            </span>
          )}
          <div className="c__filter-item__figure-wrapper">
            <figure
              className="d-inline m-0"
              style={{
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                display: "flex",
              }}
            >
              <svg width={12} height={7} viewBox="0 0 12 7" fill="none">
                <path
                  d="M0.833313 0.833344L5.83331 5.83334L10.8333 0.833344"
                  stroke="#2458F1"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </figure>
          </div>
        </div>
      </button>

      {isOpen && filterDef.options.length > 0 && (
        <div
          className="c__dropdown c__dropdown--with-checkbox c__dropdown--active"
          role="listbox"
          aria-multiselectable="true"
          style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 150 }}
        >
          <div className="c__dropdown__wrapper">
            {visibleOpts.map((opt) => {
              const isChecked = selected.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isChecked}
                  className={`c__dropdown__list-item c__dropdown__list-item--type-checkbox c__dropdown__list-item--type-checkbox--${
                    isChecked ? "checked" : "unchecked"
                  } c__tab-button`}
                  tabIndex={0}
                  onClick={() => onToggle(opt.value)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && onToggle(opt.value)
                  }
                >
                  <div className="c__dropdown__list-item__checkbox-wrapper">
                    <figure className={`m-0 c__dropdown__list-item__checkbox--inactive${isChecked ? " d-none" : ""}`}>
                      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                        <rect x="0.5" y="0.5" width={15} height={15} rx="3.5" fill="white" />
                        <rect x="0.5" y="0.5" width={15} height={15} rx="3.5" stroke="#A8A9AB" />
                      </svg>
                    </figure>
                    <figure className={`m-0 c__dropdown__list-item__checkbox--active${isChecked ? "" : " d-none"}`}>
                      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                        <rect x="0.5" y="0.5" width={15} height={15} rx="3.5" fill="#E9EFFF" />
                        <path
                          d="M12 5L6.5 10.5L4 8"
                          stroke="#2458F1"
                          strokeWidth="1.6666"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect x="0.5" y="0.5" width={15} height={15} rx="3.5" stroke="#2458F1" />
                      </svg>
                    </figure>
                  </div>
                  <span>{opt.label}</span>
                </div>
              );
            })}

            {hasMore && (
              <button
                type="button"
                className="c__dropdown__see-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((v) => !v);
                }}
              >
                {expanded
                  ? "See Less"
                  : `See More${hiddenCount > 0 ? ` (${hiddenCount})` : ""}`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
