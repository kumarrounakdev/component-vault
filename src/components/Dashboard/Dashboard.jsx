import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VaultContext } from "../../context/VaultContext";
import EmptyState from "../EmptyState/EmptyState";
import "./Dashboard.css";

const Dashboard = () => {
  const {
    components,
    toggleFavourite,
    deleteComponent,
    getFilteredComponents,
    activeFilter,
    searchQuery,
  } = useContext(VaultContext);

  const navigate = useNavigate();

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
              : `No components in "${activeFilter}" filter`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {(activeFilter !== "all" || searchQuery) && (
        <div className="dashboard__status">
          <span className="dashboard__status-text">
            Showing {filtered.length}{" "}
            {filtered.length === 1 ? "component" : "components"}
            {activeFilter !== "all" && (
              <span className="dashboard__status-filter">{activeFilter}</span>
            )}
            {searchQuery && (
              <span className="dashboard__status-query">"{searchQuery}"</span>
            )}
          </span>
        </div>
      )}

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
                <h3 className="card__title">{comp.name}</h3>
                <p className="card__desc">{comp.description}</p>
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