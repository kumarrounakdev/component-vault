import React, {
  useContext,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { VaultContext } from "../../context/VaultContext";
import EmptyState from "../EmptyState/EmptyState";
import DashboardCard from "./DashboardCard";
import { importVault } from "../../utils/importVault";
import "./Dashboard.css";

const Dashboard = () => {
  const {
    components,
    toggleFavourite,
    deleteComponent,
    duplicateComponent,
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
  const [copiedId, setCopiedId] = useState(null);
  const [view, setView] = useState("grid");

  const handleCopyCode = useCallback(async (comp) => {
    try {
      await navigator.clipboard.writeText(comp.code || "");
      setCopiedId(comp.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard unavailable
    }
  }, []);

  const handleFavourite = useCallback(
    (comp) => toggleFavourite(comp.id),
    [toggleFavourite]
  );

  const handleDelete = useCallback(
    (comp) => deleteComponent(comp.id),
    [deleteComponent]
  );

  const handleDuplicate = useCallback(
    (comp) => duplicateComponent(comp.id),
    [duplicateComponent]
  );

  const handleEdit = useCallback(
    (comp) => navigate(`/component/${comp.id}?edit=true`),
    [navigate]
  );

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

  const filtered = useMemo(
    () => getFilteredComponents(),
    // getFilteredComponents closes over the latest filter, search, and sort state
    [getFilteredComponents]
  );

  if (components.length === 0) {
    return <EmptyState />;
  }

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

        <div className="dashboard__view-toggle">
          <button
            type="button"
            className={`dashboard__view-btn ${
              view === "grid" ? "dashboard__view-btn--active" : ""
            }`}
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
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
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            className={`dashboard__view-btn ${
              view === "list" ? "dashboard__view-btn--active" : ""
            }`}
            onClick={() => setView("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
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
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`dashboard__grid ${
          view === "list" ? "dashboard__grid--list" : ""
        }`}
      >
        {filtered.map((comp) => (
          <DashboardCard
            key={comp.id}
            comp={comp}
            searchQuery={searchQuery}
            copiedId={copiedId}
            onCopy={handleCopyCode}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onFavourite={handleFavourite}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;