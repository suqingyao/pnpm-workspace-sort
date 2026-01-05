export const sortObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc: any, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
};

export interface WorkspaceData {
  packages?: string[];
  catalog?: Record<string, string>;
  catalogs?: Record<string, Record<string, string>>;
  [key: string]: any;
}

export interface SortResult {
  doc: WorkspaceData;
  changed: boolean;
  changes: string[];
}

export function sortWorkspaceData(doc: WorkspaceData): SortResult {
  let changed = false;
  const changes: string[] = [];

  // Sort packages
  if (doc.packages && Array.isArray(doc.packages)) {
    const original = JSON.stringify(doc.packages);
    doc.packages.sort((a, b) => a.localeCompare(b));
    if (JSON.stringify(doc.packages) !== original) {
      changed = true;
      changes.push('Sorted packages.');
    }
  }

  // Sort catalog
  if (doc.catalog && typeof doc.catalog === 'object') {
    const original = JSON.stringify(doc.catalog);
    doc.catalog = sortObject(doc.catalog);
    if (JSON.stringify(doc.catalog) !== original) {
      changed = true;
      changes.push('Sorted catalog dependencies.');
    }
  }

  // Sort catalogs (named catalogs)
  if (doc.catalogs && typeof doc.catalogs === 'object') {
    const sortedCatalogs: Record<string, Record<string, string>> = {};
    
    // Sort keys of catalogs (the catalog names)
    const catalogNames = Object.keys(doc.catalogs).sort((a, b) => a.localeCompare(b));
    
    for (const name of catalogNames) {
        const cat = doc.catalogs[name];
        // Sort dependencies inside each catalog
        sortedCatalogs[name] = sortObject(cat);
    }

    if (JSON.stringify(doc.catalogs) !== JSON.stringify(sortedCatalogs)) {
        doc.catalogs = sortedCatalogs;
        changed = true;
        changes.push('Sorted named catalogs dependencies.');
    }
  }

  return { doc, changed, changes };
}
