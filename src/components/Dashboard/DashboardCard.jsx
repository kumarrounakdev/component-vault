import React, { memo } from "react";
import { Link } from "react-router-dom";
import { VaultContext } from "../../context/VaultContext";

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

const DashboardCard = memo(
  ({
    comp,
    searchQuery,
    copiedId,
    onCopy,
    onEdit,
    onDuplicate,
    onDelete,
    onFavourite,
  }) => {
    const { getTagColor } = React.useContext(VaultContext);

    return (
      <div className="card">
        <Link to={`/component/${comp.id}`} className="card__body">
          <div className="card__header">
            <span
              className="card__tag tag-pill"
              style={{
                "--pill-text": getTagColor(comp.tag).text,
                "--pill-bg": getTagColor(comp.tag).bg,
                "--pill-border": getTagColor(comp.tag).border,
              }}
            >
              {comp.tag}
            </span>
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
              className={`card__action card__action--copy ${
                copiedId === comp.id ? "card__action--copied" : ""
              }`}
              onClick={() => onCopy(comp)}
              aria-label="Copy component code"
            >
              {copiedId === comp.id ? (
                <svg
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="card__action card__action--edit"
              onClick={() => onEdit(comp)}
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
              className="card__action card__action--duplicate"
              onClick={() => onDuplicate(comp)}
              aria-label="Duplicate component"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>

            <button
              type="button"
              className="card__action card__action--delete"
              onClick={() => onDelete(comp)}
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
            className={`card__fav ${comp.favourite ? "card__fav--active" : ""}`}
            onClick={() => onFavourite(comp)}
            aria-label={
              comp.favourite ? "Remove from favourites" : "Add to favourites"
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
    );
  }
);

export default DashboardCard;