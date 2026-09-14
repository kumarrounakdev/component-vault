import React, { useState, useContext, useEffect } from "react";
import AddToCollection from "../AddToCollection/AddToCollection";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Editor, { loader } from "@monaco-editor/react";
import { VaultContext } from "../../context/VaultContext";
import {
  editorTheme,
  editorOptions,
  THEME_NAME,
} from "../../assets/theme/editorTheme";
import "./ComponentView.css";

loader.init().then((monaco) => {
  monaco.editor.defineTheme(THEME_NAME, editorTheme);
});

const ComponentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    getComponent,
    deleteComponent,
    toggleFavourite,
    updateComponent,
    tags,
    isNameTaken,
  } = useContext(VaultContext);
  const component = getComponent(id);

  const [activeTab, setActiveTab] = useState("jsx");
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editCss, setEditCss] = useState("");
  const [errors, setErrors] = useState({});

  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const { getComponentCollections } = useContext(VaultContext);
  const componentCollections = component ? getComponentCollections(id) : [];

  useEffect(() => {
    if (component) {
      setEditName(component.name);
      setEditTag(component.tag);
      setEditDescription(component.description);
      setEditCode(component.code || "");
      setEditCss(component.css || "");
    }
  }, [component]);

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);

  const handleDelete = () => {
    deleteComponent(id);
    navigate("/");
  };

  const handleCopy = () => {
    const codeToCopy = activeTab === "jsx" ? component.code : component.css;
    navigator.clipboard.writeText(codeToCopy || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setEditName(component.name);
    setEditTag(component.tag);
    setEditDescription(component.description);
    setEditCode(component.code || "");
    setEditCss(component.css || "");
  };

  const validate = () => {
    const newErrors = {};
    if (!editName.trim()) newErrors.name = "Component name is required";
    else if (isNameTaken(editName, id))
      newErrors.name = "A component with this name already exists";
    if (!editDescription.trim())
      newErrors.description = "Description is required";
    if (!editCode.trim()) newErrors.code = "Code cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    updateComponent(id, {
      name: editName.trim(),
      tag: editTag,
      description: editDescription.trim(),
      code: editCode,
      css: editCss,
    });

    setIsEditing(false);
    setErrors({});
  };

  if (!component) {
    return (
      <div className="component-view component-view--empty">
        <h2>Component not found</h2>
        <Link to="/" className="component-view__back">
          ← Back to vault
        </Link>
      </div>
    );
  }

  return (
    <div className="component-view">
      <div className="component-view__topbar">
        <Link to="/" className="component-view__back">
          ← Back
        </Link>

        <div className="component-view__topbar-actions">
          {isEditing ? (
            <button
              type="button"
              className="component-view__cancel-btn"
              onClick={handleCancel}
            >
              Cancel Editing
            </button>
          ) : (
            <>
              <button
                type="button"
                className={`component-view__fav ${
                  component.favourite ? "component-view__fav--active" : ""
                }`}
                onClick={() => toggleFavourite(id)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={component.favourite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              {/* Add to Collection */}
              <button
                type="button"
                className="component-view__collection-btn"
                onClick={() => setShowCollectionModal(true)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
                {componentCollections.length > 0 && (
                  <span className="component-view__collection-count">
                    {componentCollections.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="component-view__edit-btn"
                onClick={handleEdit}
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
                Edit
              </button>

              <button
                type="button"
                className="component-view__delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="component-view__header">
        <div className="component-view__meta">
          {isEditing ? (
            <div className="component-view__edit-tags">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`component-view__edit-tag ${
                    editTag === t ? "component-view__edit-tag--active" : ""
                  }`}
                  onClick={() => setEditTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          ) : (
            <>
              <span className="component-view__tag">{component.tag}</span>
              <span className="component-view__date">
                {new Date(component.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        {isEditing ? (
          <div className="component-view__edit-fields">
            <div className="component-view__edit-field">
              <label className="component-view__edit-label">NAME</label>
              <input
                type="text"
                className={`component-view__edit-input ${
                  errors.name ? "component-view__edit-input--error" : ""
                }`}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              {errors.name && (
                <span className="component-view__edit-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="component-view__edit-field">
              <label className="component-view__edit-label">DESCRIPTION</label>
              <textarea
                className={`component-view__edit-textarea ${
                  errors.description
                    ? "component-view__edit-textarea--error"
                    : ""
                }`}
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              {errors.description && (
                <span className="component-view__edit-error">
                  {errors.description}
                </span>
              )}
            </div>
          </div>
        ) : (
          <>
            <h1 className="component-view__title">{component.name}</h1>
            <p className="component-view__desc">{component.description}</p>
          </>
        )}
      </div>

      <div className="component-view__code-section">
        <div className="component-view__code-header">
          <div className="component-view__tabs">
            <button
              type="button"
              className={`component-view__tab ${
                activeTab === "jsx" ? "component-view__tab--active" : ""
              }`}
              onClick={() => setActiveTab("jsx")}
            >
              JSX
            </button>
            <button
              type="button"
              className={`component-view__tab ${
                activeTab === "css" ? "component-view__tab--active" : ""
              }`}
              onClick={() => setActiveTab("css")}
            >
              CSS
            </button>
          </div>

          <div className="component-view__code-actions">
            {errors.code && activeTab === "jsx" && (
              <span className="component-view__edit-error">{errors.code}</span>
            )}

            {!isEditing && (
              <button
                type="button"
                className="component-view__copy"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
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
                    Copied
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            )}

            {isEditing && (
              <span className="component-view__editing-badge">EDITING</span>
            )}
          </div>
        </div>

        <div className="component-view__editor-wrapper">
          {activeTab === "jsx" ? (
            <Editor
              height="600px"
              language="javascript"
              theme={THEME_NAME}
              value={isEditing ? editCode : component.code || "// No code"}
              onChange={(value) => isEditing && setEditCode(value || "")}
              options={{
                ...editorOptions,
                readOnly: !isEditing,
                domReadOnly: !isEditing,
                cursorStyle: isEditing ? "line" : "line-thin",
              }}
            />
          ) : (
            <Editor
              height="600px"
              language="css"
              theme={THEME_NAME}
              value={isEditing ? editCss : component.css || "/* No styles */"}
              onChange={(value) => isEditing && setEditCss(value || "")}
              options={{
                ...editorOptions,
                readOnly: !isEditing,
                domReadOnly: !isEditing,
                cursorStyle: isEditing ? "line" : "line-thin",
              }}
            />
          )}
        </div>
      </div>

      {isEditing && (
        <div className="component-view__save-bar">
          <div className="component-view__save-bar-info">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>You have unsaved changes</span>
          </div>

          <div className="component-view__save-bar-actions">
            <button
              type="button"
              className="component-view__save-bar-cancel"
              onClick={handleCancel}
            >
              Discard
            </button>
            <button
              type="button"
              className="component-view__save-bar-save"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
      {showCollectionModal && (
        <AddToCollection
          componentId={id}
          onClose={() => setShowCollectionModal(false)}
        />
      )}
      </div>
  );
};

export default ComponentView;
