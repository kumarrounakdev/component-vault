# Component Vault

A personal vault for storing, organizing, and editing reusable code components. Built with React 19, Vite, and Monaco Editor.

## Features

- **Create & edit components** with a Monaco code editor (JSX + CSS tabs)
- **Live JSX preview** while editing, with editor line/char stats, keyboard shortcuts (E/S/Esc), and debounced auto-save status
- **Organize with tags** — create, manage, and filter by custom tags (multi-tag filtering, color-coded pills)
- **Search** components by name, description, or tag (debounced, with match highlighting in cards)
- **Collections** — group components into named sets and filter the dashboard by collection
- **Favourites, recent & recently-edited** filters, plus date/name sorting, grid/list view toggle
- **Copy code** with one click, duplicate a component, trash with restore / permanent delete
- **Reset vault** — double-confirmed clear-all-data button
- **Import / Export** the whole vault to/from JSON
- **Toast notifications** for lightweight in-app feedback
- **Search shortcut** — Ctrl/Cmd+K focuses the navbar search
- **Seed data** — a few sample components on first run
- **localStorage persistence** — no backend required, everything stays in your browser

## Tech Stack

- [React](https://react.dev/) 19 + [Vite](https://vite.dev/) 8
- [React Router](https://reactrouter.com/) v7
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) via `@monaco-editor/react`

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint                   |

## Usage

1. Click **+ Add Component**, fill in name/tag/description, and write or paste your JSX and CSS.
2. Browse stored components on the dashboard; use the search bar, sort controls, and filter menu (tags, favourites, recent, collections).
3. Open any component to view, edit (with live preview and auto-save), copy, duplicate, or add it to collections.
4. Manage tags anytime from the navbar's tag button; export or reset the vault from the navbar.