# 📦 Component Vault

A clean, local-first workspace to store, organize, edit, and live-preview reusable React UI components.

[🚀 Live Demo](https://componentvault.netlify.app/) · [🐛 Report Bug](https://github.com/your-username/component-vault/issues)

---

## ⚡ Key Features

### 💻 Code Editing & Live Preview
- **Monaco Editor**: Multi-tab code editor (JSX + CSS) powered by the VS Code core engine.
- **Real-Time Preview**: Live JSX component preview that updates as you type.
- **Editor Stats & Auto-Save**: Real-time line/character counts and debounced automatic saving.

### 🏷️ Organization & Discovery
- **Tags**: Create, manage, and assign custom color-coded tags with multi-tag filtering.
- **Collections**: Group components into named sets (e.g., *Navbars*, *Buttons*, *Cards*).
- **Global Search**: Debounced search across titles, descriptions, and tags with visual match highlighting.
- **Smart Views**: Dedicated views for Favourites, Recently Added, Recently Edited, and Trash.
- **Layout Toggles**: Switch effortlessly between Grid and List view layouts.

### 💾 Data & Operations
- **Local-First**: All data is stored locally in `localStorage` — zero setup, zero backend required.
- **Import / Export**: Backup or transfer your entire library via JSON files.
- **One-Click Actions**: Quick copy-to-clipboard, component duplication, and soft-delete/restore trash workflow.
- **Vault Reset**: Double-confirmed clear-all utility to safely reset your vault to factory state.
- **Seed Data**: Includes sample components out-of-the-box on your first launch.

---

## 🛠️ Tech Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Core UI rendering, interactive preview state, and component architecture |
| **Build Tooling** | **Vite 8** | Rapid development server with Hot Module Replacement (HMR) & production bundling |
| **Routing** | **React Router v7** | Client-side page navigation, URL parameters, and view switching |
| **Code Editor** | **Monaco Editor** | Embedded VS Code engine via `@monaco-editor/react` for JSX/CSS editing |
| **Storage & State** | **Browser `localStorage`** | 100% client-side data persistence with zero backend dependency |
| **Deployment** | **Netlify** | Continuous integration and production web hosting |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Context | Action |
| :--- | :--- | :--- |
| `Cmd / Ctrl` + `K` | Global | Focus navbar search bar |
| `E` | Component View | Edit current component |
| `S` | Editor | Save changes |
| `Esc` | Modal / Editor | Close view / Cancel editing |

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/component-vault.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd component-vault
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Vite development server with HMR |
| `npm run build` | Compiles production-ready bundle |
| `npm run preview` | Serves local production build for testing |
| `npm run lint` | Runs ESLint for code quality & formatting checks |

---

## 📖 Basic Workflow

1. **Create**: Click **+ Add Component**, set the title, description, and tags, then write your JSX and CSS.
2. **Preview & Edit**: Edit code in real-time with Monaco Editor while monitoring live changes in the preview tab.
3. **Organize**: Categorize items into custom **Collections** or filter by **Tags** and **Favourites**.
4. **Backup**: Export your vault periodically via the navbar to keep your component library backed up.

---
