import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { VaultContext } from "../../context/VaultContext";
import "./Collections.css";

const Collections = () => {
  const {
    collections,
    components,
    addCollection,
    deleteCollection,
    setActiveFilter,
  } = useContext(VaultContext);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) {
      setError("Collection name is required");
      return;
    }

    const success = addCollection(newName, newDesc);
    if (!success) {
      setError("Collection already exists");
      return;
    }

    setNewName("");
    setNewDesc("");
    setError("");
    setShowCreate(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === "Escape") {
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
      setError("");
    }
  };

  const getCollectionComponents = (col) => {
    return components.filter((comp) => col.componentIds.includes(comp.id));
  };

  return (
    <div className="collections">
      <div className="collections__header">
        <div className="collections__header-text">
          <h1 className="collections__title">Collections</h1>
          <p className="collections__subtitle">
            Organize your components into named groups.
          </p>
        </div>

        {!showCreate && (
          <button
            type="button"
            className="collections__create-btn"
            onClick={() => setShowCreate(true)}
          >
            + New Collection
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="collections__create">
          <div className="collections__create-field">
            <label className="collections__create-label">NAME</label>
            <input
              type="text"
              className={`collections__create-input ${
                error ? "collections__create-input--error" : ""
              }`}
              placeholder="e.g. Dashboard Components"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {error && (
              <span className="collections__create-error">{error}</span>
            )}
          </div>

          <div className="collections__create-field">
            <label className="collections__create-label">
              DESCRIPTION (OPTIONAL)
            </label>
            <input
              type="text"
              className="collections__create-input"
              placeholder="Brief description..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="collections__create-actions">
            <button
              type="button"
              className="collections__create-cancel"
              onClick={() => {
                setShowCreate(false);
                setNewName("");
                setNewDesc("");
                setError("");
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="collections__create-save"
              onClick={handleCreate}
            >
              Create Collection
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {collections.length === 0 && !showCreate && (
        <div className="collections__empty">
          <div className="collections__empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="collections__empty-title">No collections yet</h3>
          <p className="collections__empty-desc">
            Create your first collection to organize components.
          </p>
          <button
            type="button"
            className="collections__empty-btn"
            onClick={() => setShowCreate(true)}
          >
            + Create Collection
          </button>
        </div>
      )}

      {/* Collection Cards */}
      {collections.length > 0 && (
        <div className="collections__grid">
          {collections.map((col) => {
            const colComponents = getCollectionComponents(col);

            return (
              <div className="collection-card" key={col.id}>
                <Link
                  to="/"
                  className="collection-card__body"
                  onClick={() => setActiveFilter(`collection:${col.id}`)}
                >
                  <div className="collection-card__icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>

                  <h3 className="collection-card__name">{col.name}</h3>

                  {col.description && (
                    <p className="collection-card__desc">{col.description}</p>
                  )}

                  <div className="collection-card__meta">
                    <span className="collection-card__count">
                      {colComponents.length}{" "}
                      {colComponents.length === 1 ? "component" : "components"}
                    </span>
                    <span className="collection-card__date">
                      {new Date(col.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Component preview avatars */}
                  {colComponents.length > 0 && (
                    <div className="collection-card__preview">
                      {colComponents.slice(0, 3).map((comp) => (
                        <span
                          key={comp.id}
                          className="collection-card__preview-tag"
                        >
                          {comp.name.slice(0, 12)}
                        </span>
                      ))}
                      {colComponents.length > 3 && (
                        <span className="collection-card__preview-more">
                          +{colComponents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>

                <div className="collection-card__divider"></div>

                <div className="collection-card__footer">
                  <Link
                    to="/"
                    className="collection-card__view"
                    onClick={() => setActiveFilter(`collection:${col.id}`)}
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    className="collection-card__delete"
                    onClick={() => deleteCollection(col.id)}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Collections;