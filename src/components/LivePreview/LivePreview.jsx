import { useEffect, useRef, useState } from "react";
import "./LivePreview.css";

const TOKEN_VARS = {
  "--background": "#10141a",
  "--surface": "#10141a",
  "--surface-lowest": "#0a0e14",
  "--surface-low": "#181c22",
  "--surface-container": "#1c2026",
  "--surface-high": "#262a31",
  "--surface-highest": "#31353c",
  "--text-primary": "#dfe2eb",
  "--text-secondary": "#c0c7d4",
  "--text-muted": "#8b919d",
  "--border": "#414752",
  "--border-light": "#444c56",
  "--primary": "#58a6ff",
  "--primary-hover": "#79b8ff",
  "--primary-text": "#00315c",
  "--primary-glow": "rgba(88, 166, 255, 0.2)",
  "--error": "#93000a",
  "--error-text": "#ffb4ab",
  "--font-sans": '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  "--font-mono": '"Fira Code", monospace',
  "--radius-sm": "4px",
  "--radius": "8px",
  "--radius-md": "12px",
  "--radius-lg": "16px",
  "--radius-full": "9999px",
  "--space-xs": "4px",
  "--space-sm": "8px",
  "--space-md": "16px",
  "--space-lg": "24px",
  "--space-xl": "32px",
  "--fs-h1": "32px",
  "--fs-h2": "24px",
  "--fs-h3": "18px",
  "--fs-body-lg": "16px",
  "--fs-body-sm": "14px",
  "--fs-code": "13px",
  "--fs-label": "11px",
};

const tokensCss = Object.entries(TOKEN_VARS)
  .map(([k, v]) => `${k}: ${v};`)
  .join("\n");

const escapeScript = (value) =>
  JSON.stringify(value).replace(/<\/script/gi, "<\\/script");

const EMPTY_DOC = `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body style="margin:0"></body></html>`;

const buildPreviewDoc = (code, css) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
:root {
${tokensCss}
}
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 8px;
}
body {
  min-height: 100vh;
  background: var(--surface-lowest);
  color: var(--text-primary);
  font-family: var(--font-sans);
  line-height: 1.5;
}
h1, h2, h3, p { margin: 0; }
code, pre { font-family: var(--font-mono); font-size: var(--fs-code); }
#preview-style { display: none; }
#preview-error {
  display: none;
  padding: 12px 16px;
  margin: 8px 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  color: var(--error-text);
  background: rgba(147, 0, 10, 0.12);
  border: 1px solid rgba(255, 180, 171, 0.3);
  border-radius: var(--radius);
  white-space: pre-wrap;
  word-break: break-word;
}
#preview-empty {
  display: none;
  padding: 32px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
}
</style>
</head>
<body>
<style id="preview-style"></style>
<div id="root"></div>
<div id="preview-error"></div>
<div id="preview-empty">Nothing to preview</div>
<script crossorigin src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script>
(function () {
  var code = ${escapeScript(code)};
  var css = ${escapeScript(css)};
  var root = document.getElementById("root");
  var errorEl = document.getElementById("preview-error");
  var emptyEl = document.getElementById("preview-empty");

  document.getElementById("preview-style").textContent = css;

  function showError(message) {
    root.innerHTML = "";
    emptyEl.style.display = "none";
    errorEl.style.display = "block";
    errorEl.textContent = message || "Unable to render preview";
  }

  function showResult(element) {
    errorEl.style.display = "none";
    emptyEl.style.display = "none";
    ReactDOM.createRoot(root).render(element);
  }

  if (!code.trim()) {
    root.innerHTML = "";
    errorEl.style.display = "none";
    emptyEl.style.display = "block";
    return;
  }

  try {
    var compiled = Babel.transform(
      "(function(React){ return (" + code + "); })",
      { presets: ["react"] }
    ).code.replace(/;+\\s*$/, "");
    var factory = new Function("React", "return (" + compiled + ");");
    showResult(factory(React));
  } catch (err) {
    try {
      var compiled2 = Babel.transform(
        "(function(React){ " + code + "; if (typeof element !== 'undefined') return element; })",
        { presets: ["react"] }
      ).code.replace(/;+\\s*$/, "");
      var factory2 = new Function("React", "return (" + compiled2 + ");");
      showResult(factory2(React));
    } catch (innerErr) {
      showError(innerErr && innerErr.message);
    }
  }
})();
</script>
</body>
</html>`;

const LivePreview = ({ code = "", css = "" }) => {
  const [doc, setDoc] = useState(EMPTY_DOC);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const delay = isFirstRender.current ? 0 : 300;
    isFirstRender.current = false;
    const timer = setTimeout(() => {
      setDoc(buildPreviewDoc(code, css));
    }, delay);
    return () => clearTimeout(timer);
  }, [code, css]);

  return (
    <div className="live-preview">
      <iframe
        className="live-preview__frame"
        title="Live JSX preview"
        sandbox="allow-scripts"
        srcDoc={doc}
      />
    </div>
  );
};

export default LivePreview;