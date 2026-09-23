import { useContext } from "react";
import { Link } from "react-router-dom";
import { VaultContext } from "../../context/VaultContext";
import "./Trash.css";

const Trash = () => {
  const {
    trash,
    restoreComponent,
    permanentlyDelete,
    emptyTrash,
    getTagColor,
  } = useContext(VaultContext);

  const handlePermanentDelete = (comp) => {
    if (
      window.confirm(
        `Permanently delete "${comp.name}"? This cannot be undone.`
      )
    ) {
      permanentlyDelete(comp.id);
    }
  };

  const handleEmptyTrash = () => {
    if (
      window.confirm(
        `Permanently delete all ${trash.length} trashed components? This cannot be undone.`
      )
    ) {
      emptyTrash();
    }
  };

  return (
    <div className="trash">
      <div className="trash__header">
        <div className="trash__header-text">
          <h1 className="trash__title">Trash</h1>
          <p className="trash__subtitle">
            Recently deleted components. Restore them here or delete forever.
          </p>
        </div>

        {trash.length > 0 && (
          <button
            type="button"
            className="trash__empty-all"
            onClick={handleEmptyTrash}
          >
            Empty Trash
          </button>
        )}
      </div>

      {trash.length === 0 ? (
        <div className="trash__empty">
          <div className="trash__empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
          <h3 className="trash__empty-title">Trash is empty</h3>
          <p className="trash__empty-desc">
            Deleted components will appear here so you can restore them.
          </p>
          <Link to="/" className="trash__empty-btn">
            Back to vault
          </Link>
        </div>
      ) : (
        <div className="trash__list">
          {trash.map((comp) => (
            <div className="trash-item" key={comp.id}>
              <div className="trash-item__body">
                <div className="trash-item__header">
                  <span
                    className="trash-item__tag tag-pill"
                    style={{
                      "--pill-text": getTagColor(comp.tag).text,
                      "--pill-bg": getTagColor(comp.tag).bg,
                      "--pill-border": getTagColor(comp.tag).border,
                    }}
                  >
                    {comp.tag}
                  </span>
                  <span className="trash-item__date">
                    Deleted{" "}
                    {new Date(comp.deletedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="trash-item__name">{comp.name}</h3>
                <p className="trash-item__desc">{comp.description}</p>
              </div>

              <div className="trash-item__divider"></div>

              <div className="trash-item__footer">
                <button
                  type="button"
                  className="trash-item__restore"
                  onClick={() => restoreComponent(comp.id)}
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
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  Restore
                </button>
                <button
                  type="button"
                  className="trash-item__delete"
                  onClick={() => handlePermanentDelete(comp)}
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
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;