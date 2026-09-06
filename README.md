# Component Vault

A personal vault for storing, organizing, and editing reusable code components. Built with React 19, Vite, and Monaco Editor.

## Features

- **Create & edit components** with a Monaco code editor (JSX + CSS tabs)
- **Organize with tags** — create, manage, and filter by custom tags
- **Search** components by name, description, or tag
- **Collections** — group components into named sets and filter the dashboard by collection
- **Favourites & recent** filters for quick access
- **Copy code** with one click
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
2. Browse stored components on the dashboard; use the search bar and filter menu (tags, favourites, recent, collections).
3. Open any component to view, edit, copy, or add it to collections.
4. Manage tags anytime from the navbar's tag button.