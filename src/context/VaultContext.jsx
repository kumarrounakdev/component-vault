import { createContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SAMPLE_COMPONENTS } from "../data/sampleComponents";

// Context + provider live together intentionally; disable fast-refresh rule for this file
// eslint-disable-next-line react-refresh/only-export-components
export const VaultContext = createContext();

const STORAGE_KEY = "component-vault";
const TAGS_STORAGE_KEY = "component-vault-tags";
const COLLECTIONS_STORAGE_KEY = "component-vault-collections";
const TRASH_STORAGE_KEY = "component-vault-trash";
const DEFAULT_TAGS = ["UI", "HOOKS", "LAYOUTS", "UTILS", "FORMS", "DATA"];

const TAG_PALETTE = [
  { text: "#58a6ff", bg: "rgba(88, 166, 255, 0.12)", border: "rgba(88, 166, 255, 0.25)" },
  { text: "#6fdd78", bg: "rgba(111, 221, 120, 0.12)", border: "rgba(111, 221, 120, 0.25)" },
  { text: "#ffd169", bg: "rgba(255, 209, 105, 0.12)", border: "rgba(255, 209, 105, 0.25)" },
  { text: "#ff9c6b", bg: "rgba(255, 156, 107, 0.12)", border: "rgba(255, 156, 107, 0.25)" },
  { text: "#d3bbff", bg: "rgba(211, 187, 255, 0.12)", border: "rgba(211, 187, 255, 0.25)" },
  { text: "#ff8eb3", bg: "rgba(255, 142, 179, 0.12)", border: "rgba(255, 142, 179, 0.25)" },
  { text: "#7ee7ee", bg: "rgba(126, 231, 238, 0.12)", border: "rgba(126, 231, 238, 0.25)" },
  { text: "#10b981", bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.25)" },
];

const getTagColor = (tagName) => {
  const key = (tagName || "").trim().toUpperCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return TAG_PALETTE[hash % TAG_PALETTE.length];
};

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data === null) {
      return SAMPLE_COMPONENTS.map((sample, index) => ({
        ...sample,
        id: `sample-${index}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const loadTagsFromStorage = () => {
  try {
    const data = localStorage.getItem(TAGS_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_TAGS;
  } catch {
    return DEFAULT_TAGS;
  }
};

const loadCollectionsFromStorage = () => {
  try {
    const data = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const loadTrashFromStorage = () => {
  try {
    const data = localStorage.getItem(TRASH_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (components) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(components));
  } catch (e) {
    console.error("Failed to save:", e);
  }
};

const saveTagsToStorage = (tags) => {
  try {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
  } catch (e) {
    console.error("Failed to save tags:", e);
  }
};

const saveCollectionsToStorage = (collections) => {
  try {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
  } catch (e) {
    console.error("Failed to save collections:", e);
  }
};

const saveTrashToStorage = (deleted) => {
  try {
    localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(deleted));
  } catch (e) {
    console.error("Failed to save trash:", e);
  }
};

export const VaultProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [components, setComponents] = useState(loadFromStorage);
  const [tags, setTags] = useState(loadTagsFromStorage);
  const [collections, setCollections] = useState(loadCollectionsFromStorage);
  const [trash, setTrash] = useState(loadTrashFromStorage);
  const [activeFilter, setActiveFilter] = useState(
    () => searchParams.get("filter") || "all"
  );
  const [activeTagFilters, setActiveTagFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || ""
  );
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    saveToStorage(components);
  }, [components]);

  useEffect(() => {
    saveTagsToStorage(tags);
  }, [tags]);

  useEffect(() => {
    saveCollectionsToStorage(collections);
  }, [collections]);

  useEffect(() => {
    saveTrashToStorage(trash);
  }, [trash]);

  // Components
  const addComponent = (newComponent) => {
    setComponents((prev) => [
      ...prev,
      {
        ...newComponent,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        favourite: false,
      },
    ]);
  };

  const isNameTaken = (name, excludeId = null) => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return false;
    return components.some(
      (c) => c.id !== excludeId && c.name.trim().toLowerCase() === trimmed
    );
  };

  const getComponent = (id) => {
    return components.find((c) => c.id === id) || null;
  };

  const toggleFavourite = (id) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, favourite: !comp.favourite } : comp
      )
    );
  };

  const deleteComponent = (id) => {
    const comp = components.find((c) => c.id === id);
    if (!comp) return;

    setComponents((prev) => prev.filter((c) => c.id !== id));
    setTrash((prev) => [
      { ...comp, deletedAt: new Date().toISOString() },
      ...prev,
    ]);
    // Remove from all collections
    setCollections((prev) =>
      prev.map((col) => ({
        ...col,
        componentIds: col.componentIds.filter((cId) => cId !== id),
      }))
    );
  };

  const restoreComponent = (id) => {
    const comp = trash.find((c) => c.id === id);
    if (!comp) return;

    setTrash((prev) => prev.filter((c) => c.id !== id));
    const restored = { ...comp };
    delete restored.deletedAt;
    setComponents((prev) => [...prev, restored]);
  };

  const permanentlyDelete = (id) => {
    setTrash((prev) => prev.filter((c) => c.id !== id));
  };

  const emptyTrash = () => {
    setTrash([]);
  };

  const updateComponent = (id, updatedData) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id
          ? { ...comp, ...updatedData, updatedAt: new Date().toISOString() }
          : comp
      )
    );
  };

  const duplicateComponent = (id) => {
    const source = components.find((c) => c.id === id);
    if (!source) return;

    setComponents((prev) => [
      ...prev,
      {
        ...source,
        id: Date.now().toString(),
        name: `${source.name} (copy)`,
        favourite: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const importVaultData = (data) => {
    if (Array.isArray(data.components)) {
      setComponents(data.components);
    }
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      setTags(data.tags);
    }
    if (Array.isArray(data.collections)) {
      setCollections(data.collections);
    }
  };

  const clearAllData = () => {
    setComponents([]);
    setTags(DEFAULT_TAGS);
    setCollections([]);
    setTrash([]);
    setActiveFilter("all");
    setActiveTagFilters([]);
    setSearchQuery("");
  };

  // Tags
  const addTag = (tagName) => {
    const formatted = tagName.trim().toUpperCase();
    if (!formatted) return false;
    if (tags.includes(formatted)) return false;
    setTags((prev) => [...prev, formatted]);
    return true;
  };

  const deleteTag = (tagName) => {
    if (DEFAULT_TAGS.includes(tagName)) return false;
    setTags((prev) => prev.filter((t) => t !== tagName));
    setActiveTagFilters((prev) => prev.filter((t) => t !== tagName));
    setComponents((prev) =>
      prev.map((comp) =>
        comp.tag === tagName ? { ...comp, tag: "UI" } : comp
      )
    );
    return true;
  };

  const isDefaultTag = (tagName) => {
    return DEFAULT_TAGS.includes(tagName);
  };

  // Collections
  const addCollection = (name, description) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    if (collections.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      return false;
    }

    setCollections((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: trimmedName,
        description: description?.trim() || "",
        componentIds: [],
        createdAt: new Date().toISOString(),
      },
    ]);
    return true;
  };

  const getCollection = (id) => {
    return collections.find((c) => c.id === id) || null;
  };

  const updateCollection = (id, updatedData) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === id ? { ...col, ...updatedData } : col
      )
    );
  };

  const deleteCollection = (id) => {
    setCollections((prev) => prev.filter((col) => col.id !== id));
  };

  const addToCollection = (collectionId, componentId) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col.id === collectionId) {
          if (col.componentIds.includes(componentId)) return col;
          return {
            ...col,
            componentIds: [...col.componentIds, componentId],
          };
        }
        return col;
      })
    );
  };

  const removeFromCollection = (collectionId, componentId) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col.id === collectionId) {
          return {
            ...col,
            componentIds: col.componentIds.filter((id) => id !== componentId),
          };
        }
        return col;
      })
    );
  };

  const getComponentCollections = (componentId) => {
    return collections.filter((col) =>
      col.componentIds.includes(componentId)
    );
  };

  // Filtering
  const toggleTagFilter = (tagName) => {
    setActiveTagFilters((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const getFilteredComponents = () => {
    let filtered = [...components];

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (comp) =>
          comp.name.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query) ||
          comp.tag.toLowerCase().includes(query)
      );
    }

    if (activeTagFilters.length > 0) {
      filtered = filtered.filter((comp) =>
        activeTagFilters.includes(comp.tag)
      );
    }

    switch (activeFilter) {
      case "favourites":
        filtered = filtered.filter((comp) => comp.favourite);
        break;
      case "recent":
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "edited":
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );
        break;
      default: {
        // Check collection filter
        if (activeFilter.startsWith("collection:")) {
          const colId = activeFilter.replace("collection:", "");
          const collection = getCollection(colId);
          if (collection) {
            filtered = filtered.filter((comp) =>
              collection.componentIds.includes(comp.id)
            );
          }
        }
        break;
      }
    }

    if (sortBy === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return filtered;
  };

  return (
    <VaultContext.Provider
      value={{
        components,
        tags,
        collections,
        trash,
        activeFilter,
        setActiveFilter,
        activeTagFilters,
        toggleTagFilter,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        addComponent,
        isNameTaken,
        getComponent,
        toggleFavourite,
        deleteComponent,
        restoreComponent,
        permanentlyDelete,
        emptyTrash,
        updateComponent,
        duplicateComponent,
        importVaultData,
        clearAllData,
        addTag,
        deleteTag,
        isDefaultTag,
        addCollection,
        getCollection,
        updateCollection,
        deleteCollection,
        addToCollection,
        removeFromCollection,
        getComponentCollections,
        getFilteredComponents,
        getTagColor,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};