import React, { useState, useContext, useEffect, useRef } from "react";
import AddToCollection from "../AddToCollection/AddToCollection";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
  useBlocker,
} from "react-router-dom";
import Editor, { loader } from "@monaco-editor/react";
import LivePreview from "../LivePreview/LivePreview";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
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
    duplicateComponent,
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
  const [saveStatus, setSaveStatus] = useState("idle");

  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const { getComponentCollections } = useContext(VaultContext);
  const componentCollections = component ? getComponentCollections(id) : [];
  const blocker = useBlocker(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isEditing]);

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

  useEffect(() => {
    if (!isEditing) {
      setSaveStatus("idle");
      return;
    }
    setSaveStatus("unsaved");
    const timer = setTimeout(() => {
      if (!editName.trim() || !editDescription.trim() || !editCode.trim()) {
        setSaveStatus("dirty");
        return;
      }
      setSaveStatus("saving");
      updateComponent(id, {
        name: editName.trim(),
        tag: editTag,
        description: editDescription.trim(),
        code: editCode,
        css: editCss,
      });
      setSaveStatus("saved");
    }, 1000);
    return () => clearTimeout(timer);
  }, [isEditing, editName, editTag, editDescription, editCode, editCss]);

  const handleDelete = () => {
    deleteComponent(id);
    navigate("/");
  };

  const handleDuplicate = () => {
    duplicateComponent(id);
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
    setSaveStatus("unsaved");
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

  const latestRef = useRef({ isEditing, handleEdit, handleSave, handleCancel });
  latestRef.current = { isEditing, handleEdit, handleSave, handleCancel };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable ||
          (target.closest && target.closest(".monaco-editor")))
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const { isEditing: editing, handleEdit, handleSave, handleCancel } =
        latestRef.current;

      if (key === "e" && !editing) {
        e.preventDefault();
        handleEdit();
      } else if (key === "s" && editing) {
        e.preventDefault();
        handleSave();
      } else if (key === "escape" && editing) {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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

  const savedCode = component.code || "";
  const savedCss = component.css || "";
  const currentCode =
    activeTab === "css"
      ? isEditing
        ? editCss
        : savedCss
      : isEditing
        ? editCode
        : savedCode;
  const lineCount = currentCode === "" ? 0 : currentCode.split("\n").length;
  const charCount = currentCode.length;

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
                className="component-view__duplicate-btn"
                onClick={handleDuplicate}
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
                Duplicate
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
            <button
              type="button"
              className={`component-view__tab ${
                activeTab === "preview" ? "component-view__tab--active" : ""
              }`}
              onClick={() => setActiveTab("preview")}
            >
              PREVIEW
            </button>
          </div>

          <div className="component-view__code-actions">
            {errors.code && activeTab === "jsx" && (
              <span className="component-view__edit-error">{errors.code}</span>
            )}

            {!isEditing && activeTab !== "preview" && (
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
            {isEditing && saveStatus !== "idle" && (
              <span
                className={`component-view__autosave component-view__autosave--${saveStatus}`}
              >
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "Auto-saved"}
                {saveStatus === "unsaved" && "Unsaved changes"}
                {saveStatus === "dirty" && "Complete the fields to save"}
              </span>
            )}
          </div>
        </div>

        <div className="component-view__editor-wrapper">
          {activeTab === "preview" ? (
            <LivePreview
              code={isEditing ? editCode : component.code || ""}
              css={isEditing ? editCss : component.css || ""}
            />
          ) : activeTab === "jsx" ? (
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

        {activeTab !== "preview" && (
          <div className="component-view__stats">
            <span className="component-view__stats-item">
              {lineCount} lines
            </span>
            <span className="component-view__stats-item">
              {charCount} chars
            </span>
          </div>
        )}
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
      {blocker.state === "blocked" && (
        <ConfirmDialog
          title="Discard unsaved changes?"
          message="You have unsaved edits to this component. Leaving now will discard them."
          confirmLabel="Discard & Leave"
          cancelLabel="Stay"
          destructive
          onConfirm={blocker.proceed}
          onClose={blocker.reset}
        />
      )}
      </div>
  );
};

export default ComponentView;
