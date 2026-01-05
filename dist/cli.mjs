#!/usr/bin/env node

// src/cli.ts
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

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
  const filePath = path.resolve(process.cwd(), WORKSPACE_FILE);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${WORKSPACE_FILE} not found in current directory.`);
    process.exit(1);
  }
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const doc = yaml.load(fileContent);
    if (!doc) {
      console.error("Error: Failed to parse YAML file or file is empty.");
      process.exit(1);
    }
    const result = sortWorkspaceData(doc);
    if (result.changed) {
      result.changes.forEach((msg) => console.log(msg));
      const newYaml = yaml.dump(result.doc, {
        indent: 2,
        lineWidth: -1,
        // Don't wrap long lines
        noRefs: true,
        quotingType: '"'
      });
      fs.writeFileSync(filePath, newYaml, "utf8");
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
//# sourceMappingURL=cli.mjs.map