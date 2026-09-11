import React, { useContext } from "react";
import { VaultContext } from "../../context/VaultContext";
import "./AddToCollection.css";

const AddToCollection = ({ componentId, onClose }) => {
  const {
    collections,
    addToCollection,
    removeFromCollection,
  } = useContext(VaultContext);

  const handleToggle = (collectionId, isInCollection) => {
    if (isInCollection) {
      removeFromCollection(collectionId, componentId);
    } else {
      addToCollection(collectionId, componentId);
    }
  };

  return (
    <div className="atc-overlay" onClick={onClose}>
      <div className="atc" onClick={(e) => e.stopPropagation()}>
        <div className="atc__header">
          <h3 className="atc__title">Add to Collection</h3>
          <button
            type="button"
            className="atc__close"
            onClick={onClose}
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

        {collections.length === 0 ? (
          <div className="atc__empty">
            <p>No collections yet. Create one from the Collections page.</p>
          </div>
        ) : (
          <div className="atc__list">
            {collections.map((col) => {
              const isIn = col.componentIds.includes(componentId);

              return (
                <button
                  key={col.id}
                  type="button"
                  className={`atc__item ${isIn ? "atc__item--active" : ""}`}
                  onClick={() => handleToggle(col.id, isIn)}
                >
                  <div className="atc__item-check">
                    {isIn && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  <div className="atc__item-info">
                    <span className="atc__item-name">{col.name}</span>
                    <span className="atc__item-count">
                      {col.componentIds.length}{" "}
                      {col.componentIds.length === 1
                        ? "component"
                        : "components"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCollection;