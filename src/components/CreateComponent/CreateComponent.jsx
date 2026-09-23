import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Editor, { loader } from "@monaco-editor/react";
import { VaultContext } from "../../context/VaultContext";
import {
  editorTheme,
  editorOptions,
  THEME_NAME,
} from "../../assets/theme/editorTheme";
import "./CreateComponent.css";

loader.init().then((monaco) => {
  monaco.editor.defineTheme(THEME_NAME, editorTheme);
});

const CreateComponent = () => {
  const { addComponent, tags, addTag, isNameTaken } = useContext(VaultContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [tag, setTag] = useState(tags[0] || "UI");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState(`const MyComponent = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};

export default MyComponent;`);
  const [cssCode, setCssCode] = useState(`/* Component styles */
.my-component {
  
}`);
  const [activeTab, setActiveTab] = useState("jsx");
  const [errors, setErrors] = useState({});

  // New tag creation state
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagError, setNewTagError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Component name is required";
    else if (isNameTaken(name))
      newErrors.name = "A component with this name already exists";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!code.trim()) newErrors.code = "Code cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addComponent({
      name: name.trim(),
      tag,
      description: description.trim(),
      code,
      css: cssCode,
    });

    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleCreateTag = () => {
    const formatted = newTagName.trim().toUpperCase();

    if (!formatted) {
      setNewTagError("Tag name cannot be empty");
      return;
    }

    if (formatted.length > 20) {
      setNewTagError("Max 20 characters");
      return;
    }

    if (!/^[A-Z0-9-_ ]+$/.test(formatted)) {
      setNewTagError("Only letters, numbers, hyphens");
      return;
    }

    const success = addTag(formatted);
    if (!success) {
      setNewTagError("Tag already exists");
      return;
    }

    setTag(formatted);
    setNewTagName("");
    setNewTagError("");
    setShowNewTag(false);
  };

  const handleNewTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateTag();
    }
    if (e.key === "Escape") {
      setShowNewTag(false);
      setNewTagName("");
      setNewTagError("");
    }
  };

  return (
    <div className="create">
      <div className="create__header">
        <button type="button" className="create__back" onClick={handleCancel}>
          ← Back
        </button>
        <h1 className="create__title">Create Component</h1>
        <p className="create__subtitle">
          Add a new component to your vault with code and styles.
        </p>
      </div>

      <form className="create__form" onSubmit={handleSubmit}>
        <div className="create__details">
          <div className="create__field">
            <label className="create__label" htmlFor="comp-name">
              NAME
            </label>
            <input
              id="comp-name"
              type="text"
              className={`create__input ${
                errors.name ? "create__input--error" : ""
              }`}
              placeholder="e.g. PrimaryButton"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <span className="create__error">{errors.name}</span>
            )}
          </div>

          <div className="create__field">
            <label className="create__label">TAG</label>
            <div className="create__tags-wrapper">
              <div className="create__tags">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`create__tag ${
                      tag === t ? "create__tag--active" : ""
                    }`}
                    onClick={() => setTag(t)}
                  >
                    {t}
                  </button>
                ))}

                {/* New Tag Toggle Button */}
                {!showNewTag && (
                  <button
                    type="button"
                    className="create__tag create__tag--new"
                    onClick={() => setShowNewTag(true)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    NEW TAG
                  </button>
                )}
              </div>

              {/* Inline New Tag Input */}
              {showNewTag && (
                <div className="create__new-tag">
                  <div className="create__new-tag-row">
                    <input
                      type="text"
                      className={`create__new-tag-input ${
                        newTagError ? "create__new-tag-input--error" : ""
                      }`}
                      placeholder="e.g. ANIMATIONS"
                      value={newTagName}
                      onChange={(e) => {
                        setNewTagName(e.target.value);
                        setNewTagError("");
                      }}
                      onKeyDown={handleNewTagKeyDown}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="create__new-tag-add"
                      onClick={handleCreateTag}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="create__new-tag-cancel"
                      onClick={() => {
                        setShowNewTag(false);
                        setNewTagName("");
                        setNewTagError("");
                      }}
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
                  {newTagError && (
                    <span className="create__new-tag-error">{newTagError}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="create__field">
            <label className="create__label" htmlFor="comp-desc">
              DESCRIPTION
            </label>
            <textarea
              id="comp-desc"
              className={`create__textarea ${
                errors.description ? "create__textarea--error" : ""
              }`}
              placeholder="Briefly describe what this component does..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <span className="create__error">{errors.description}</span>
            )}
          </div>
        </div>

        <div className="create__editor-section">
          <div className="create__editor-header">
            <div className="create__tabs">
              <button
                type="button"
                className={`create__tab ${
                  activeTab === "jsx" ? "create__tab--active" : ""
                }`}
                onClick={() => setActiveTab("jsx")}
              >
                JSX
              </button>
              <button
                type="button"
                className={`create__tab ${
                  activeTab === "css" ? "create__tab--active" : ""
                }`}
                onClick={() => setActiveTab("css")}
              >
                CSS
              </button>
            </div>

            {errors.code && activeTab === "jsx" && (
              <span className="create__error">{errors.code}</span>
            )}
          </div>

          <div className="create__editor-wrapper">
            {activeTab === "jsx" ? (
              <Editor
                height="600px"
                language="javascript"
                theme={THEME_NAME}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={editorOptions}
              />
            ) : (
              <Editor
                height="600px"
                language="css"
                theme={THEME_NAME}
                value={cssCode}
                onChange={(value) => setCssCode(value || "")}
                options={editorOptions}
              />
            )}
          </div>
        </div>

        <div className="create__actions">
          <button
            type="button"
            className="create__cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="submit" className="create__submit">
            + Add to Vault
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateComponent;