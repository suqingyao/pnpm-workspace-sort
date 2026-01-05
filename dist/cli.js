#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_js_yaml = __toESM(require("js-yaml"));

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

// src/cli.ts
var WORKSPACE_FILE = "pnpm-workspace.yaml";
function run() {
  const filePath = import_path.default.resolve(process.cwd(), WORKSPACE_FILE);
  if (!import_fs.default.existsSync(filePath)) {
    console.error(`Error: ${WORKSPACE_FILE} not found in current directory.`);
    process.exit(1);
  }
  try {
    const fileContent = import_fs.default.readFileSync(filePath, "utf8");
    const doc = import_js_yaml.default.load(fileContent);
    if (!doc) {
      console.error("Error: Failed to parse YAML file or file is empty.");
      process.exit(1);
    }
    const result = sortWorkspaceData(doc);
    if (result.changed) {
      result.changes.forEach((msg) => console.log(msg));
      const newYaml = import_js_yaml.default.dump(result.doc, {
        indent: 2,
        lineWidth: -1,
        // Don't wrap long lines
        noRefs: true,
        quotingType: '"'
      });
      import_fs.default.writeFileSync(filePath, newYaml, "utf8");
      console.log(`Successfully updated ${WORKSPACE_FILE}`);
    } else {
      console.log("Already sorted. No changes made.");
    }
  } catch (e) {
    console.error("Error processing YAML file:", e);
    process.exit(1);
  }
}
run();
//# sourceMappingURL=cli.js.map