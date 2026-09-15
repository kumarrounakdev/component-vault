export const importVault = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data.components)) {
          reject(new Error("Invalid file: missing components array"));
          return;
        }
        resolve({
          components: data.components,
          tags: Array.isArray(data.tags) ? data.tags : [],
          collections: Array.isArray(data.collections)
            ? data.collections
            : [],
        });
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file);
  });
};