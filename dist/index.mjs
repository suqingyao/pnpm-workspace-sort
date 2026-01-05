// src/index.ts
var sortObject = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  return Object.keys(obj).sort((a, b) => a.localeCompare(b)).reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
};
function sortWorkspaceData(doc) {
  let changed = false;
  const changes = [];
  if (doc.packages && Array.isArray(doc.packages)) {
    const original = JSON.stringify(doc.packages);
    doc.packages.sort((a, b) => a.localeCompare(b));
    if (JSON.stringify(doc.packages) !== original) {
      changed = true;
      changes.push("Sorted packages.");
    }
  }
  if (doc.catalog && typeof doc.catalog === "object") {
    const original = JSON.stringify(doc.catalog);
    doc.catalog = sortObject(doc.catalog);
    if (JSON.stringify(doc.catalog) !== original) {
      changed = true;
      changes.push("Sorted catalog dependencies.");
    }
  }
  if (doc.catalogs && typeof doc.catalogs === "object") {
    const sortedCatalogs = {};
    const catalogNames = Object.keys(doc.catalogs).sort((a, b) => a.localeCompare(b));
    for (const name of catalogNames) {
      const cat = doc.catalogs[name];
      sortedCatalogs[name] = sortObject(cat);
    }
    if (JSON.stringify(doc.catalogs) !== JSON.stringify(sortedCatalogs)) {
      doc.catalogs = sortedCatalogs;
      changed = true;
      changes.push("Sorted named catalogs dependencies.");
    }
  }
  return { doc, changed, changes };
}
export {
  sortObject,
  sortWorkspaceData
};
//# sourceMappingURL=index.mjs.map