"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Drawer } from "vaul";
import FilterDropdown from "./FilterDropdown";
import JobCard from "./JobCard";
import {
  EMPTY_FILTERS,
  LAST_BOARD_URL_STORAGE_KEY,
  URL_KEYS,
  hasActiveFilters,
} from "@/app/lib/jobs";

const US_STATES = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

const SEARCH_DEBOUNCE_MS = 400;
const FILTER_SPINNER_MS = 700;
const SEARCH_PILL_MAX_CHARS = 20;
const LOCATION_LABEL_MAX_CHARS = 100;
const JOBS_PER_PAGE = 20;

function pushFiltersToURL(filters) {
  const p = new URLSearchParams();
  filters.category.forEach((v) => p.append(URL_KEYS.category, v));
  filters.state.forEach((v) => p.append(URL_KEYS.state, v));
  filters.jobType.forEach((v) => p.append(URL_KEYS.jobType, v));
  filters.location.forEach((v) => p.append(URL_KEYS.location, v));
  filters.status.forEach((v) => p.append(URL_KEYS.status, v));
  if (filters.search) p.set(URL_KEYS.search, filters.search);
  if (filters.sort && filters.sort !== "newest")
    p.set(URL_KEYS.sort, filters.sort);
  const qs = p.toString();
  window.history.pushState({}, "", qs ? `?${qs}` : window.location.pathname);
}

function extractState(str = "") {
  const m1 = str.match(/,\s*([A-Z]{2})\s*[-–]/);
  if (m1 && US_STATES[m1[1]]) return m1[1];
  const m2 = str.match(/,\s*([A-Z]{2})\s*$/);
  if (m2 && US_STATES[m2[1]]) return m2[1];
  return null;
}

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(str, max) {
  return str.length > max ? str.substring(0, max) + "…" : str;
}

function postedOnToDays(str = "") {
  const s = str.toLowerCase();
  if (s.includes("today")) return 0;
  if (s.includes("yesterday")) return 1;
  const days = s.match(/(\d+)\s+day/);
  if (days) return parseInt(days[1], 10);
  const weeks = s.match(/(\d+)\s+week/);
  if (weeks) return parseInt(weeks[1], 10) * 7;
  const mos = s.match(/(\d+)\s+month/);
  if (mos) return parseInt(mos[1], 10) * 30;
  return 9999;
}

const ChevronDown = ({ stroke = "#2458F1" }) => (
  <svg width={12} height={7} viewBox="0 0 12 7" fill="none">
    <path
      d="M0.833313 0.833344L5.83331 5.83334L10.8333 0.833344"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDownSort = ({ stroke = "#25282A", className }) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      d="M4 6L8 10L12 6"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
    <path
      d="M9.16659 0.833344L0.833252 9.16668M0.833252 0.833344L9.16659 9.16668"
      stroke="#2458F1"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function JobBoard({
  initialJobs = [],
  initialFilters = EMPTY_FILTERS,
}) {
  const startsFiltered = hasActiveFilters(initialFilters);
  const [jobs] = useState(initialJobs);
  const [loading, setLoading] = useState(startsFiltered);
  const [filtering, setFiltering] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search);
  const [activeDrawerFilter, setActiveDrawerFilter] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(JOBS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  const isFirstMount = useRef(true);
  const spinnerTimer = useRef(null);
  const sortRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!startsFiltered) return;
    const timer = window.setTimeout(() => setLoading(false), 150);
    return () => window.clearTimeout(timer);
  }, [startsFiltered]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      LAST_BOARD_URL_STORAGE_KEY,
      `${window.location.pathname}${window.location.search}`,
    );
  }, [filters]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    pushFiltersToURL(filters);
    clearTimeout(spinnerTimer.current);
    spinnerTimer.current = setTimeout(
      () => setFiltering(false),
      FILTER_SPINNER_MS,
    );
    return () => clearTimeout(spinnerTimer.current);
  }, [filters]);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    if (searchInput === filters.search) return;
    debounceTimer.current = setTimeout(() => {
      setFiltering(true);
      setVisibleCount(JOBS_PER_PAGE);
      setFilters((prev) => ({
        category: [],
        state: [],
        jobType: [],
        location: [],
        status: [],
        search: searchInput,
        sort: prev.sort,
      }));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(debounceTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const categories = [
    ...new Set(jobs.map((j) => j.jobFamilyGroup).filter(Boolean)),
  ].sort();
  const jobTypes = [
    ...new Set(jobs.map((j) => j.workerSubType).filter(Boolean)),
  ].sort();
  const locations = [
    ...new Set(jobs.map((j) => j.locationsText || j.locations).filter(Boolean)),
  ].sort();
  const statuses = [
    ...new Set(jobs.map((j) => j.timeType).filter(Boolean)),
  ].sort();
  const availableStates = [
    ...new Set(
      jobs
        .map((j) => extractState(j.locationsText || j.locations || ""))
        .filter(Boolean),
    ),
  ].sort();

  const filterDefs = [
    {
      key: "category",
      label: "Job Category",
      options: categories.map((c) => ({ value: c, label: c })),
    },
    {
      key: "state",
      label: "State",
      options: availableStates.map((s) => ({
        value: s,
        label: US_STATES[s] || s,
      })),
    },
    {
      key: "jobType",
      label: "Job Type",
      options: jobTypes.map((t) => ({ value: t, label: t })),
    },
    {
      key: "location",
      label: "Locations",
      options: locations.map((l) => ({
        value: l,
        label: truncate(l, LOCATION_LABEL_MAX_CHARS),
      })),
    },
    {
      key: "status",
      label: "Job Status",
      options: statuses.map((s) => ({ value: s, label: s })),
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const jobState = extractState(job.locationsText || job.locations || "");
    const jobLocation = job.locationsText || job.locations || "";
    const searchLower = filters.search.toLowerCase();

    if (
      filters.category.length &&
      !filters.category.includes(job.jobFamilyGroup)
    )
      return false;
    if (filters.state.length && !filters.state.includes(jobState)) return false;
    if (filters.jobType.length && !filters.jobType.includes(job.workerSubType))
      return false;
    if (filters.location.length && !filters.location.includes(jobLocation))
      return false;
    if (filters.status.length && !filters.status.includes(job.timeType))
      return false;
    if (searchLower) {
      const fullStateName = jobState ? US_STATES[jobState] || "" : "";
      const cityPart = jobLocation.split(",")[0] || "";
      const companyPart = jobLocation.includes(" - ")
        ? jobLocation.split(" - ").slice(1).join(" ")
        : "";
      const blob = [
        job.title,
        job.jobFamilyGroup,
        job.workerSubType,
        job.timeType,
        jobLocation,
        cityPart,
        fullStateName,
        jobState,
        companyPart,
        job.jobRequisitionId || "",
        stripHtml(job.jobDescription || ""),
      ]
        .join(" ")
        .toLowerCase();
      const terms = searchLower.trim().split(/\s+/);
      if (!terms.every((term) => blob.includes(term))) return false;
    }
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const dA = postedOnToDays(a.postedOn || "");
    const dB = postedOnToDays(b.postedOn || "");
    return filters.sort === "oldest" ? dB - dA : dA - dB;
  });

  const visibleJobs = sortedJobs.slice(0, visibleCount);
  const hasMore = visibleCount < sortedJobs.length;
  const remainingCount = sortedJobs.length - visibleCount;

  const toggleFilter = useCallback((key, value) => {
    setFiltering(true);
    setVisibleCount(JOBS_PER_PAGE);
    setSearchInput("");
    setFilters((prev) => ({
      ...prev,
      search: "",
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  }, []);

  const clearAll = useCallback(() => {
    setFiltering(true);
    setVisibleCount(JOBS_PER_PAGE);
    setFilters({
      category: [],
      state: [],
      jobType: [],
      location: [],
      status: [],
      search: "",
      sort: "newest",
    });
    setSearchInput("");
  }, []);

  const removeFilter = useCallback((key, value) => {
    setFiltering(true);
    setVisibleCount(JOBS_PER_PAGE);
    if (key === "search") {
      setFilters((prev) => ({ ...prev, search: "" }));
      setSearchInput("");
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: prev[key].filter((v) => v !== value),
      }));
    }
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setFiltering(true);
      setVisibleCount(JOBS_PER_PAGE);
      clearTimeout(debounceTimer.current);
      setFilters((prev) => ({
        category: [],
        state: [],
        jobType: [],
        location: [],
        status: [],
        search: searchInput,
        sort: prev.sort,
      }));
    },
    [searchInput],
  );

  const openDrawer = useCallback((key) => {
    setActiveDrawerFilter(key);
    setDrawerOpen(true);
  }, []);

  const searchLabel = filters.search
    ? `Search: ${truncate(filters.search, SEARCH_PILL_MAX_CHARS)}`
    : null;

  const activeFilterTags = [
    ...(searchLabel
      ? [{ key: "search", value: filters.search, label: searchLabel }]
      : []),
    ...filters.category.map((v) => ({ key: "category", value: v, label: v })),
    ...filters.state.map((v) => ({
      key: "state",
      value: v,
      label: US_STATES[v] || v,
    })),
    ...filters.jobType.map((v) => ({ key: "jobType", value: v, label: v })),
    ...filters.location.map((v) => ({
      key: "location",
      value: v,
      label: truncate(v, LOCATION_LABEL_MAX_CHARS),
    })),
    ...filters.status.map((v) => ({ key: "status", value: v, label: v })),
  ];

  const activeDrawerDef = filterDefs.find((f) => f.key === activeDrawerFilter);

  return (
    <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
      <section className="b__size-md">
        <div className="container">
          <Drawer.Portal>
            <Drawer.Overlay className="c__job-board-embed__drawer__overlay" />
            <Drawer.Content className="c__job-board-embed__drawer__content">
              <div className="c__job-board-embed__drawer__body">
                <div
                  aria-hidden
                  className="c__job-board-embed__drawer__handle"
                />
                <div className="c__job-board-embed__drawer__inner">
                  <div className="c__job-board-embed__drawer__inner__header">
                    <div className="c__job-board-embed__drawer__inner__header__row">
                      <div className="c__job-board-embed__drawer__inner__header__col c__job-board-embed__drawer__inner__header__col--left">
                        <div className="c__heading-wrapper mb-0">
                          <span className="c__heading u__h6 u__f-700 d-block u__heading-color--primary mb-0">
                            {activeDrawerDef?.label || "Filter"}
                          </span>
                        </div>
                      </div>
                      <div className="c__job-board-embed__drawer__inner__header__col c__job-board-embed__drawer__inner__header__col--right">
                        <div className="c__button-wrapper">
                          <button
                            className="c__button__anchor-element u__bg-transparent"
                            type="button"
                            onClick={() => {
                              if (!activeDrawerFilter) return;
                              setVisibleCount(JOBS_PER_PAGE);
                              setFilters((p) => ({
                                ...p,
                                [activeDrawerFilter]: [],
                              }));
                            }}
                          >
                            <span className="c__button c__button--type-squarish c__button--link">
                              <div className="c__button__content u__f-700">
                                <span>Clear All</span>
                              </div>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="c__job-board-embed__drawer__inner__body">
                    <div className="c__job-board-embed__drawer__inner__body__row">
                      {activeDrawerDef?.options.map((opt) => {
                        const isActive = (
                          filters[activeDrawerFilter] || []
                        ).includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            className={`c__job-board-embed__selection-pill${isActive ? " c__job-board-embed__selection-pill--active" : ""}`}
                            onClick={() =>
                              toggleFilter(activeDrawerFilter, opt.value)
                            }
                          >
                            <div className="c__job-board-embed__selection-pill__text-wrapper">
                              <span className="u__f-700">{opt.label}</span>
                            </div>
                            <div className="c__job-board-embed__selection-pill__icon-wrapper">
                              <figure className="m-0 d-inline">
                                <svg
                                  className={`c__job-board-embed__selection-pill__icon c__job-board-embed__selection-pill__icon--plus${isActive ? " d-none" : ""}`}
                                  width={14}
                                  height={14}
                                  viewBox="0 0 14 14"
                                  fill="none"
                                >
                                  <path
                                    d="M7 2.91669V11.0834"
                                    stroke="#2458F1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M2.91675 7H11.0834"
                                    stroke="#2458F1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <svg
                                  className={`c__job-board-embed__selection-pill__icon c__job-board-embed__selection-pill__icon--check${isActive ? "" : " d-none"}`}
                                  width={14}
                                  height={14}
                                  viewBox="0 0 14 14"
                                  fill="none"
                                >
                                  <path
                                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                    stroke="white"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </figure>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="c__job-board-embed__drawer__inner__footer">
                    <div className="c__button-wrapper">
                      <button
                        className="c__button c__button--primary c__button--rounded u__f-700"
                        type="button"
                        onClick={() => setDrawerOpen(false)}
                      >
                        <div className="c__button__content u__f-700">
                          <span>Show Results ({filteredJobs.length})</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>

          <div
            className={`c__job-board-embed${activeFilterTags.length > 0 ? " c__job-board-embed--filters-active" : ""}`}
          >
            {/* Header / Search */}
            <div className="c__job-board-embed__header">
              <div className="c__job-board-embed__header__row">
                <div className="c__job-board-embed__header__col c__job-board-embed__header__col--left">
                  <div className="c__heading-wrapper">
                    <h2 className="c__heading u__h3 u__f-700 d-block u__heading-color--primary mb-0">
                      Browse Open Positions
                    </h2>
                  </div>
                </div>
                <div className="c__job-board-embed__header__col c__job-board-embed__header__col--right">
                  <form
                    className="c__job-board-embed__search-form"
                    onSubmit={handleSearch}
                  >
                    <div className="c__job-board-embed__search-form__input-wrapper">
                      <div className="c__job-board-embed__search-form__figure-wrapper">
                        <figure className="m-0 d-inline">
                          <svg
                            width={22}
                            height={22}
                            viewBox="0 0 23 23"
                            fill="none"
                          >
                            <path
                              d="M19.6 19.6L15.54 15.54M17.7334 10.2667C17.7334 14.3904 14.3904 17.7333 10.2667 17.7333C6.14299 17.7333 2.80005 14.3904 2.80005 10.2667C2.80005 6.14294 6.14299 2.8 10.2667 2.8C14.3904 2.8 17.7334 6.14294 17.7334 10.2667Z"
                              stroke="#25282A"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </figure>
                      </div>
                      <input
                        type="text"
                        placeholder="Job Title, Skill or Keyword"
                        aria-label="Job Title, Skill or Keyword"
                        autoComplete="off"
                        className="c__job-board-embed__search-form__input"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                    <span className="c__job-board-embed__search-form__button-wrapper">
                      <button
                        className="c__job-board-embed__search-form__button c__button c__button--primary c__button--rounded u__f-700"
                        type="submit"
                      >
                        <div className="c__button__content u__f-700">
                          <span>Search Jobs</span>
                        </div>
                      </button>
                    </span>
                  </form>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="c__job-board-embed__filter-bar mt-4 pt-1 pt-sm-2 pt-md-3 pt-lg-4">
              <div className="c__filter-bar__row">
                <div className="c__filter-bar__col c__filter-bar__col--left">
                  {/* Mobile filters */}
                  <div className="c__filter-bar__filter-list c__filter-bar__filter-list--mobile u__hide-after-992">
                    <div className="c__filter-bar__filter-list__row">
                      <div className="c__filter-bar__filter-list__col c__filter-bar__filter-list__col--left">
                        <div className="c__filter-bar__filter-list__label-wrapper">
                          <span className="c__filter-bar__filter-list__label u__f-700 u__p">
                            Filter By:
                          </span>
                        </div>
                      </div>
                      <div className="c__filter-bar__filter-list__col c__filter-bar__filter-list__col--right">
                        <div className="c__filter-bar__filter-list__filters">
                          <div className="c__filter-bar__filter-list__filters__row">
                            {filterDefs.map((fd, i) => (
                              <div
                                key={fd.key}
                                className={`c__filter-bar__filter-list__filters__col c__filter-bar__filter-list__filters__col--${i + 1}`}
                              >
                                <button
                                  type="button"
                                  className="c__filter-item"
                                  onClick={() => openDrawer(fd.key)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                  }}
                                >
                                  <div className="c__filter-item__label-wrapper">
                                    <span className="c__filter-item__label">
                                      {fd.label}
                                    </span>
                                    {filters[fd.key]?.length > 0 && (
                                      <span className="c__filter-item__count-badge">
                                        {filters[fd.key].length}
                                      </span>
                                    )}
                                    <div className="c__filter-item__figure-wrapper">
                                      <figure className="d-inline m-0">
                                        <ChevronDown />
                                      </figure>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            ))}
                            {activeFilterTags.length > 0 && (
                              <div className="c__filter-bar__filter-list__filters__col c__filter-bar__filter-list__filters__col--clear">
                                <div
                                  className="c__filter-item"
                                  onClick={clearAll}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="c__filter-item__label-wrapper">
                                    <span className="c__filter-item__label">
                                      Clear All
                                    </span>
                                    <div className="c__filter-item__figure-wrapper">
                                      <figure className="d-inline m-0">
                                        <XIcon />
                                      </figure>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop filters */}
                  <div className="c__filter-bar__filter-list c__filter-bar__filter-list--desktop u__show-after-992">
                    <div className="c__filter-bar__filter-list__row">
                      <div className="c__filter-bar__filter-list__col c__filter-bar__filter-list__col--left">
                        <div className="c__filter-bar__filter-list__label-wrapper">
                          <span className="c__filter-bar__filter-list__label u__f-700 u__p">
                            Filter By:
                          </span>
                        </div>
                      </div>
                      <div className="c__filter-bar__filter-list__col c__filter-bar__filter-list__col--right">
                        <div className="c__filter-bar__filter-list__filters">
                          <div className="c__filter-bar__filter-list__filters__row">
                            {filterDefs.map((fd, i) => (
                              <div
                                key={fd.key}
                                className={`c__filter-bar__filter-list__filters__col c__filter-bar__filter-list__filters__col--${i + 1}`}
                              >
                                <FilterDropdown
                                  filterDef={fd}
                                  selected={filters[fd.key]}
                                  onToggle={(val) => toggleFilter(fd.key, val)}
                                  isOpen={openDropdown === fd.key}
                                  onOpen={() =>
                                    setOpenDropdown(
                                      openDropdown === fd.key ? null : fd.key,
                                    )
                                  }
                                  onClose={() => setOpenDropdown(null)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Clear All */}
                <div className="c__filter-bar__col c__filter-bar__col--right u__show-after-992">
                  {activeFilterTags.length > 0 && (
                    <div className="c__filter-bar__filter-list__filters__col c__filter-bar__filter-list__filters__col--clear">
                      <div
                        className="c__filter-item"
                        onClick={clearAll}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="c__filter-item__label-wrapper">
                          <span className="c__filter-item__label">
                            Clear All
                          </span>
                          <div className="c__filter-item__figure-wrapper">
                            <figure className="d-inline m-0">
                              <XIcon />
                            </figure>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="c__job-board-embed__body">
              {(loading || filtering) && (
                <div className="c__spinner-wrapper--viewport">
                  <div className="c__spinner-parent">
                    <svg className="c__spinner" viewBox="0 0 50 50">
                      <circle
                        className="path"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="5"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {!loading && !filtering && activeFilterTags.length > 0 && (
                <div className="c__job-board-embed__selected-filters-list mt-4 pt-1 pt-sm-2 pt-md-3 pt-lg-4">
                  <div className="c__job-board-embed__selected-filters-list__row">
                    {activeFilterTags.map((tag) => (
                      <div
                        key={`${tag.key}-${tag.value}`}
                        className="c__selected-filters__list-item"
                      >
                        <div className="c__selected-filters__list-item__label-wrapper u__f-700">
                          <span className="c__selected-filters__list-item__label">
                            {tag.label}
                          </span>
                        </div>
                        <div className="c__selected-filters__list-item__figure-wrapper">
                          <figure
                            className="c__selected-filters__list-item__figure c__selected-filters__list-item--clear-handler"
                            onClick={() => removeFilter(tag.key, tag.value)}
                            style={{ cursor: "pointer" }}
                          >
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M10.5 3.5L3.5 10.5"
                                stroke="#2458F1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M3.5 3.5L10.5 10.5"
                                stroke="#2458F1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </figure>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && !filtering && (
                <div className="c__job-board-embed__board mt-4 pt-4">
                  {sortedJobs.length > 0 && (
                    <div className="c__job-board-embed__board__header">
                      <div className="c__job-board-embed__board__header__row">
                        <div className="c__job-board-embed__board__header__col c__job-board-embed__board__header__col--left">
                          <div className="c__heading-wrapper">
                            <span className="c__heading u__h6 u__f-700 d-block u__heading-color--primary mb-0">
                              {sortedJobs.length} Job Openings
                            </span>
                          </div>
                        </div>
                        <div className="c__job-board-embed__board__header__col c__job-board-embed__board__header__col--right">
                          <div
                            ref={sortRef}
                            className="c__job-board-embed__board__header__sort-box"
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => setSortOpen((v) => !v)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "4px 0",
                                color: "inherit",
                              }}
                            >
                              <span
                                className="u__p"
                                style={{ fontSize: "14px" }}
                              >
                                Sort by:{" "}
                                <strong>
                                  {filters.sort === "newest"
                                    ? "Newest"
                                    : "Oldest"}
                                </strong>
                              </span>
                              <ChevronDownSort className="c__job-board-embed__board__header__sort-box__chev-icon" />
                            </button>
                            {sortOpen && (
                              <div
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "calc(100% + 4px)",
                                  zIndex: 200,
                                  background: "white",
                                  border: "1px solid #EBEBEB",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                  overflow: "hidden",
                                  minWidth: "130px",
                                }}
                              >
                                {[
                                  { value: "newest", label: "Newest" },
                                  { value: "oldest", label: "Oldest" },
                                ].map((s) => (
                                  <div
                                    key={s.value}
                                    onClick={() => {
                                      setFiltering(true);
                                      setVisibleCount(JOBS_PER_PAGE);
                                      setFilters((p) => ({
                                        ...p,
                                        sort: s.value,
                                      }));
                                      setSortOpen(false);
                                    }}
                                    style={{
                                      padding: "10px 16px",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      fontWeight:
                                        filters.sort === s.value
                                          ? "700"
                                          : "400",
                                      color:
                                        filters.sort === s.value
                                          ? "#2458F1"
                                          : "#25282A",
                                      background:
                                        filters.sort === s.value
                                          ? "#F4F7FF"
                                          : "transparent",
                                      transition: "background 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                      if (filters.sort !== s.value)
                                        e.currentTarget.style.background =
                                          "#F8F8F8";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        filters.sort === s.value
                                          ? "#F4F7FF"
                                          : "transparent";
                                    }}
                                  >
                                    {s.label}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="c__job-board-embed__board__body mt-4">
                    {sortedJobs.length === 0 && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "48px 0",
                          color: "#505457",
                        }}
                      >
                        <p className="u__p mb-4 pb-2">
                          No jobs found matching your current filters.
                        </p>
                        <button
                          type="button"
                          className="c__button c__button--primary c__button--rounded u__f-700"
                          onClick={clearAll}
                        >
                          <div className="c__button__content u__f-700">
                            <span>Clear All Filters</span>
                          </div>
                        </button>
                      </div>
                    )}

                    {visibleJobs.map((job) => (
                      <JobCard
                        key={job.jobRequisitionId || job.externalPath}
                        job={job}
                      />
                    ))}

                    {hasMore && (
                      <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <div className="c__button-wrapper">
                          <button
                            className={`c__button c__button--primary c__button--rounded u__f-700${loadingMore ? " c__button--loading" : ""}`}
                            type="button"
                            disabled={loadingMore}
                            onClick={() => {
                              setLoadingMore(true);
                              setTimeout(() => {
                                setVisibleCount((n) => n + JOBS_PER_PAGE);
                                setLoadingMore(false);
                              }, FILTER_SPINNER_MS);
                            }}
                          >
                            <div className="c__button__content u__f-700">
                              {loadingMore ? (
                                <svg
                                  className="c__spinner"
                                  viewBox="0 0 50 50"
                                  style={{
                                    width: 18,
                                    height: 18,
                                    marginRight: 6,
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <circle
                                    className="path"
                                    cx="25"
                                    cy="25"
                                    r="20"
                                    fill="none"
                                    strokeWidth="5"
                                  />
                                </svg>
                              ) : null}
                              <span>
                                {loadingMore
                                  ? "Loading…"
                                  : `Load More (${remainingCount} remaining)`}
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Drawer.Root>
  );
}
