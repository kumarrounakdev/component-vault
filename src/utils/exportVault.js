const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportVault = (data) => {
  const payload = {
    exportedAt: new Date().toISOString(),
    components: data.components || [],
    tags: data.tags || [],
    collections: data.collections || [],
  };

  const date = new Date().toISOString().slice(0, 10);
  const filename = `component-vault-${date}.json`;

  downloadFile(JSON.stringify(payload, null, 2), filename, "application/json");
};