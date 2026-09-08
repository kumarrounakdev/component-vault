import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmptyState.css";

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="empty">
      <div className="empty__icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>

      <h2 className="empty__title">No components yet</h2>
      <p className="empty__desc">
        Start building your vault by creating your first component.
      </p>

      <button
        type="button"
        className="empty__btn"
        onClick={() => navigate("/create")}
      >
        + Create Component
      </button>
    </div>
  );
};

export default EmptyState;