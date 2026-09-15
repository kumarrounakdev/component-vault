import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VaultContext } from "../../context/VaultContext";
import EmptyState from "../EmptyState/EmptyState";
import { importVault } from "../../utils/importVault";
import "./Dashboard.css";

const Dashboard = () => {
  const {
    components,
    toggleFavourite,
    deleteComponent,
    getFilteredComponents,
    activeFilter,
    activeTagFilters,
    searchQuery,
    sortBy,
    setSortBy,
    importVaultData,
  } = useContext(VaultContext);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const data = await importVault(file);
      if (
        window.confirm(
          "Importing will replace your current vault (components, tags, collections). Continue?"
        )
      ) {
        importVaultData(data);
      }
    } catch (err) {
      window.alert(err.message || "Failed to import file");
    }
  };

  const highlightMatch = (text, query) => {
    const q = query.trim();
    if (!q || !text) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "ig"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="card__highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (components.length === 0) {
    return <EmptyState />;
  }

  const filtered = getFilteredComponents();

  if (filtered.length === 0) {
    return (
      <div className="dashboard">
        <div className="dashboard__empty-filter">
          <div className="dashboard__empty-filter-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </div>
          <h3 className="dashboard__empty-filter-title">No results found</h3>
          <p className="dashboard__empty-filter-desc">
            {searchQuery
              ? `No components match "${searchQuery}"`
              : activeTagFilters.length > 0
              ? `No components tagged ${activeTagFilters
                  .map((t) => `"${t}"`)
                  .join(", ")}`
              : `No components in "${activeFilter}" filter`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {(activeFilter !== "all" || searchQuery || activeTagFilters.length > 0) && (
        <div className="dashboard__status">
          <span className="dashboard__status-text">
            Showing {filtered.length}{" "}
            {filtered.length === 1 ? "component" : "components"}
            {activeFilter !== "all" && (
              <span className="dashboard__status-filter">{activeFilter}</span>
            )}
            {activeTagFilters.length > 0 && (
              <span className="dashboard__status-filter">
                {activeTagFilters.join(", ")}
              </span>
            )}
            {searchQuery && (
              <span className="dashboard__status-query">"{searchQuery}"</span>
            )}
          </span>
        </div>
      )}

      <div className="dashboard__toolbar">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="dashboard__file-input"
          onChange={handleImportFile}
        />
        <button
          type="button"
          className="dashboard__import-btn"
          onClick={handleImportClick}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Import
        </button>
        <div className="dashboard__sort">
          <span className="dashboard__sort-label">Sort</span>
          <button
            type="button"
            className={`dashboard__sort-btn ${
              sortBy === "date" ? "dashboard__sort-btn--active" : ""
            }`}
            onClick={() => setSortBy("date")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="14" x2="10" y2="14" />
            </svg>
            Date Added
          </button>
          <button
            type="button"
            className={`dashboard__sort-btn ${
              sortBy === "name" ? "dashboard__sort-btn--active" : ""
            }`}
            onClick={() => setSortBy("name")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="4" y1="18" x2="9" y2="18" />
            </svg>
            Name
          </button>
        </div>
      </div>

      <div className="dashboard__grid">
        {filtered.map((comp) => (
          <div className="card" key={comp.id}>
            <Link to={`/component/${comp.id}`} className="card__body">
              <div className="card__header">
                <span className="card__tag">{comp.tag}</span>
                <span className="card__date">
                  {new Date(comp.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="card__content">
                <h3 className="card__title">
                  {highlightMatch(comp.name, searchQuery)}
                </h3>
                <p className="card__desc">
                  {highlightMatch(comp.description, searchQuery)}
                </p>
              </div>

              <div className="card__preview">
                <div className="card__preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <pre className="card__preview-code">
                  {comp.code
                    ? comp.code.split("\n").slice(0, 4).join("\n")
                    : "// No code yet"}
                </pre>
              </div>
            </Link>

            <div className="card__divider"></div>

            <div className="card__footer">
              <div className="card__footer-left">
                <button
                  type="button"
                  className="card__action card__action--edit"
                  onClick={() => navigate(`/component/${comp.id}?edit=true`)}
                  aria-label="Edit component"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="card__action card__action--delete"
                  onClick={() => deleteComponent(comp.id)}
                  aria-label="Delete component"
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
                </button>
              </div>

              <button
                type="button"
                className={`card__fav ${
                  comp.favourite ? "card__fav--active" : ""
                }`}
                onClick={() => toggleFavourite(comp.id)}
                aria-label={
                  comp.favourite
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={comp.favourite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;