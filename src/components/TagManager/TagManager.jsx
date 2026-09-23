import { useState, useContext } from "react";
import { VaultContext } from "../../context/VaultContext";
import "./TagManager.css";

const TagManager = ({ onClose }) => {
  const { tags, addTag, deleteTag, isDefaultTag } = useContext(VaultContext);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const formatted = newTag.trim().toUpperCase();

    if (!formatted) {
      setError("Tag name cannot be empty");
      return;
    }

    if (formatted.length > 20) {
      setError("Tag name too long (max 20 chars)");
      return;
    }

    if (!/^[A-Z0-9-_ ]+$/.test(formatted)) {
      setError("Only letters, numbers, hyphens allowed");
      return;
    }

    const success = addTag(formatted);
    if (!success) {
      setError("Tag already exists");
      return;
    }

    setNewTag("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleDelete = (tagName) => {
    deleteTag(tagName);
  };

  return (
    <div className="tag-manager-overlay" onClick={onClose}>
      <div className="tag-manager" onClick={(e) => e.stopPropagation()}>
        <div className="tag-manager__header">
          <div className="tag-manager__header-text">
            <h2 className="tag-manager__title">Manage Tags</h2>
            <p className="tag-manager__subtitle">
              Create and manage tags for organizing your components.
            </p>
          </div>

          <button
            type="button"
            className="tag-manager__close"
            onClick={onClose}
            aria-label="Close"
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
        </div>

        <div className="tag-manager__add">
          <div className="tag-manager__add-row">
            <input
              type="text"
              className={`tag-manager__input ${
                error ? "tag-manager__input--error" : ""
              }`}
              placeholder="e.g. ANIMATIONS"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="tag-manager__add-btn"
              onClick={handleAdd}
            >
              + Add Tag
            </button>
          </div>
          {error && <span className="tag-manager__error">{error}</span>}
        </div>

        <div className="tag-manager__list">
          <div className="tag-manager__list-header">
            <span className="tag-manager__list-label">
              {tags.length} {tags.length === 1 ? "tag" : "tags"}
            </span>
          </div>

          <div className="tag-manager__tags">
            {tags.map((tag) => (
              <div
                key={tag}
                className={`tag-manager__tag ${
                  isDefaultTag(tag) ? "tag-manager__tag--default" : ""
                }`}
              >
                <div className="tag-manager__tag-info">
                  <span className="tag-manager__tag-name">{tag}</span>
                  {isDefaultTag(tag) && (
                    <span className="tag-manager__tag-badge">DEFAULT</span>
                  )}
                </div>

                {!isDefaultTag(tag) && (
                  <button
                    type="button"
                    className="tag-manager__tag-delete"
                    onClick={() => handleDelete(tag)}
                    aria-label={`Delete ${tag} tag`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManager;