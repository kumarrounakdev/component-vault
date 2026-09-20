import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { VaultContext } from "../../context/VaultContext";
import TagManager from "../TagManager/TagManager";
import { exportVault } from "../../utils/exportVault";
import "./Navbar.css";

const Navbar = () => {
  const {
    components,
    tags,
    collections,
    trash,
    activeFilter,
    setActiveFilter,
    activeTagFilters,
    setActiveTagFilters,
    toggleTagFilter,
    searchQuery,
    setSearchQuery,
  } = useContext(VaultContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const [filterOpen, setFilterOpen] = useState(false);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const filterRef = useRef(null);
  const searchRef = useRef(null);

  const FILTERS = [
    { id: "all", label: "All Components" },
    { id: "favourites", label: "Favourites" },
    { id: "recent", label: "Recently Added" },
    ...tags.map((tag) => ({
      id: tag.toLowerCase(),
      label: tag,
    })),
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (activeFilter === "all") {
          params.delete("filter");
        } else {
          params.set("filter", activeFilter);
        }
        return params;
      },
      { replace: true }
    );
  }, [activeFilter, setSearchParams]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (!searchQuery) {
          params.delete("q");
        } else {
          params.set("q", searchQuery);
        }
        return params;
      },
      { replace: true }
    );
  }, [searchQuery, setSearchParams]);

  const handleAdd = () => {
    navigate("/create");
  };

  const handleExport = () => {
    exportVault({ components, tags, collections });
  };

  const handleFilterSelect = (filterId) => {
    setActiveFilter(filterId);
    setFilterOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleTagToggle = (tagName) => {
    toggleTagFilter(tagName);
  };

  const clearTagFilters = () => {
    setActiveTagFilters([]);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar__left">
          <h2
            className="navbar__title"
            onClick={() => {
              setActiveFilter("all");
              setActiveTagFilters([]);
              setSearchQuery("");
              if (location.pathname !== "/") {
                navigate("/");
              }
            }}
            style={{ cursor: "pointer" }}
          >
            Component Vault
          </h2>
          <span
            className="navbar__count-badge"
            title={`${components.length} component${components.length === 1 ? "" : "s"}`}
          >
            {components.length}
          </span>
        </div>

        <div className="navbar__center">
          <div className="navbar__search">
            <svg
              className="navbar__search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              ref={searchRef}
              type="text"
              className="navbar__search-input"
              placeholder="Search components, tags, hooks..."
              aria-label="Search components"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <button
                type="button"
                className="navbar__search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="navbar__right">
          {/* Export Link */}
          <button
            type="button"
            className="navbar__export-btn"
            onClick={handleExport}
            aria-label="Export vault to JSON"
            title="Export vault to JSON"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          {/* Collections Link */}
          <button
            type="button"
            className={`navbar__collections-btn ${
              location.pathname === "/collections"
                ? "navbar__collections-btn--active"
                : ""
            }`}
            onClick={() => navigate("/collections")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          <button
            type="button"
            className={`navbar__trash-btn ${
              location.pathname === "/trash" ? "navbar__trash-btn--active" : ""
            }`}
            onClick={() => navigate("/trash")}
            aria-label="Trash"
            title="Trash"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            {trash.length > 0 && (
              <span className="navbar__trash-badge">{trash.length}</span>
            )}
          </button>

          <button
            type="button"
            className="navbar__tags-btn"
            onClick={() => setTagManagerOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </button>

          <div className="navbar__filter" ref={filterRef}>
            <button
              type="button"
              className={`navbar__filter-toggle ${
                filterOpen ? "navbar__filter-toggle--open" : ""
              } ${
                activeFilter !== "all" || activeTagFilters.length > 0
                  ? "navbar__filter-toggle--filtered"
                  : ""
              }`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <svg
                className="navbar__filter-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>

              <span className="navbar__filter-label">
                {activeTagFilters.length > 0
                  ? `${activeTagFilters.length} tag${
                      activeTagFilters.length > 1 ? "s" : ""
                    }`
                  : activeFilter.startsWith("collection:")
                  ? collections.find(
                      (c) =>
                        c.id === activeFilter.replace("collection:", "")
                    )?.name || "Collection"
                  : FILTERS.find((f) => f.id === activeFilter)?.label ||
                    "All Components"}
              </span>

              <svg
                className={`navbar__filter-chevron ${
                  filterOpen ? "navbar__filter-chevron--open" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {filterOpen && (
              <div className="navbar__filter-dropdown">
                <div className="navbar__filter-header">Filter by</div>

                <div className="navbar__filter-section">
                  {FILTERS.slice(0, 3).map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      className={`navbar__filter-option ${
                        activeFilter === filter.id
                          ? "navbar__filter-option--active"
                          : ""
                      }`}
                      onClick={() => handleFilterSelect(filter.id)}
                    >
                      {activeFilter === filter.id ? (
                        <svg
                          className="navbar__filter-option-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="navbar__filter-option-spacer" />
                      )}
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>

                <div className="navbar__filter-divider"></div>
                <div className="navbar__filter-section-label">
                  Tags
                  {activeTagFilters.length > 0 && (
                    <button
                      type="button"
                      className="navbar__filter-clear-tags"
                      onClick={clearTagFilters}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="navbar__filter-section">
                  {FILTERS.slice(3).map((filter) => {
                    const isActive = activeTagFilters.includes(filter.label);
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        className={`navbar__filter-option ${
                          isActive ? "navbar__filter-option--active" : ""
                        }`}
                        onClick={() => handleTagToggle(filter.label)}
                      >
                        {isActive ? (
                          <svg
                            className="navbar__filter-option-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <span className="navbar__filter-option-spacer" />
                        )}
                        <span>{filter.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Collections in filter */}
                {collections.length > 0 && (
                  <>
                    <div className="navbar__filter-divider"></div>
                    <div className="navbar__filter-section-label">
                      Collections
                    </div>

                    <div className="navbar__filter-section">
                      {collections.map((col) => {
                        const colFilterId = `collection:${col.id}`;
                        return (
                          <button
                            key={col.id}
                            type="button"
                            className={`navbar__filter-option ${
                              activeFilter === colFilterId
                                ? "navbar__filter-option--active"
                                : ""
                            }`}
                            onClick={() => handleFilterSelect(colFilterId)}
                          >
                            {activeFilter === colFilterId ? (
                              <svg
                                className="navbar__filter-option-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <span className="navbar__filter-option-spacer" />
                            )}
                            <span>{col.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="navbar__filter-divider"></div>

                <button
                  type="button"
                  className="navbar__filter-manage"
                  onClick={() => {
                    setFilterOpen(false);
                    setTagManagerOpen(true);
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Manage Tags
                </button>
              </div>
            )}
          </div>

          <button type="button" className="navbar__primary" onClick={handleAdd}>
            + Add Component
          </button>
        </div>
      </header>

      {tagManagerOpen && (
        <TagManager onClose={() => setTagManagerOpen(false)} />
      )}
    </>
  );
};

export default Navbar;