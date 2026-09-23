export const SAMPLE_COMPONENTS = [
  {
    name: "PrimaryButton",
    tag: "UI",
    description:
      "A primary action button with hover, focus, and disabled states.",
    favourite: true,
    code: `const PrimaryButton = ({ children, onClick, disabled }) => {
  return (
    <button
      className="primary-btn"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;`,
    css: `.primary-btn {
  padding: 10px 18px;
  background: #58a6ff;
  color: #00315c;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.primary-btn:hover {
  background: #79b8ff;
}

.primary-btn:focus-visible {
  outline: 2px solid #58a6ff;
  outline-offset: 2px;
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
  },
  {
    name: "UserCard",
    tag: "UI",
    description:
      "A profile card showing an avatar, name, role, and quick action links.",
    favourite: false,
    code: `const UserCard = ({ name, role, avatar, onMessage }) => {
  return (
    <div className="user-card">
      <img className="user-card__avatar" src={avatar} alt={name} />
      <div className="user-card__info">
        <h3 className="user-card__name">{name}</h3>
        <p className="user-card__role">{role}</p>
      </div>
      <button
        className="user-card__action"
        type="button"
        onClick={onMessage}
      >
        Message
      </button>
    </div>
  );
};

export default UserCard;`,
    css: `.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #1c2026;
  border: 1px solid #414752;
  border-radius: 12px;
}

.user-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-card__name {
  margin: 0;
  font-size: 16px;
}

.user-card__role {
  margin: 4px 0 0;
  font-size: 13px;
  color: #8b919d;
}

.user-card__action {
  margin-left: auto;
  padding: 8px 14px;
  background: transparent;
  color: #58a6ff;
  border: 1px solid #58a6ff;
  border-radius: 8px;
  cursor: pointer;
}`,
  },
  {
    name: "TagBadge",
    tag: "UI",
    description:
      "A small mono-spaced badge used to label components and filters.",
    favourite: false,
    code: `const TagBadge = ({ label, color }) => {
  const style = color
    ? { color, border: \`1px solid \${color}\` }
    : undefined;

  return (
    <span className="tag-badge" style={style}>
      {label}
    </span>
  );
};

export default TagBadge;`,
    css: `.tag-badge {
  display: inline-flex;
  align-items: center;
  font-family: "Fira Code", monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 4px;
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.25);
  background: rgba(88, 166, 255, 0.12);
}`,
  },
  {
    name: "useLocalStorage",
    tag: "HOOKS",
    description:
      "Sync state with localStorage so a value survives page reloads.",
    favourite: true,
    code: `const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = React.useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;`,
    css: ``,
  },
  {
    name: "StatsGrid",
    tag: "LAYOUTS",
    description:
      "A responsive grid that lays out numeric stats into tidy cards.",
    favourite: false,
    code: `const StatsGrid = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="stats-grid__card">
          <span className="stats-grid__value">{stat.value}</span>
          <span className="stats-grid__label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;`,
    css: `.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.stats-grid__card {
  padding: 16px;
  background: #1c2026;
  border: 1px solid #414752;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stats-grid__value {
  font-family: "Fira Code", monospace;
  font-size: 24px;
  color: #58a6ff;
}

.stats-grid__label {
  font-size: 12px;
  color: #8b919d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}`,
  },
  {
    name: "SearchInput",
    tag: "FORMS",
    description:
      "A debounced text input with a search icon and clear button.",
    favourite: false,
    code: `const SearchInput = ({ value, onChange, placeholder }) => {
  const [local, setLocal] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => onChange(local), 250);
    return () => clearTimeout(timer);
  }, [local]);

  return (
    <div className="search-input">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
      />
      {local && (
        <button type="button" onClick={() => setLocal("")}>
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchInput;`,
    css: `.search-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 36px;
  background: #0a0e14;
  border: 1px solid #414752;
  border-radius: 8px;
}

.search-input svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #8b919d;
  stroke-width: 1.8;
}

.search-input input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #dfe2eb;
}

.search-input button {
  background: transparent;
  border: none;
  color: #8b919d;
  cursor: pointer;
}

.search-input:focus-within {
  border-color: #58a6ff;
}`,
  },
];