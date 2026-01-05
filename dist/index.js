"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  sortObject: () => sortObject,
  sortWorkspaceData: () => sortWorkspaceData
});
module.exports = __toCommonJS(index_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sortObject,
  sortWorkspaceData
});
//# sourceMappingURL=index.js.map