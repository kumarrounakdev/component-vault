import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VaultContext } from "../../context/VaultContext";
import { importVault } from "../../utils/importVault";
import "./EmptyState.css";

const EmptyState = () => {
  const navigate = useNavigate();
  const { importVaultData } = useContext(VaultContext);
  const fileInputRef = useRef(null);

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

  return (
    <div className="empty">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="empty__file-input"
        onChange={handleImportFile}
      />
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
      <button
        type="button"
        className="empty__btn empty__btn--secondary"
        onClick={() => fileInputRef.current?.click()}
      >
        Import from JSON
      </button>
    </div>
  );
};

export default EmptyState;