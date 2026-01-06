#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { sortWorkspaceData, WorkspaceData } from './index.js';

const DEFAULT_WORKSPACE_FILE = 'pnpm-workspace.yaml';

function run() {
  const args = process.argv.slice(2);
  const targetFile = args[0] || DEFAULT_WORKSPACE_FILE;
  const filePath = path.resolve(process.cwd(), targetFile);

  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${targetFile} not found in current directory.`);
    process.exit(1);
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const doc = yaml.load(fileContent) as WorkspaceData;

    if (!doc) {
      console.error('Error: Failed to parse YAML file or file is empty.');
      process.exit(1);
    }

    const result = sortWorkspaceData(doc);

    if (result.changed) {
      result.changes.forEach(msg => console.log(msg));
      
      // Dump with reasonable options
      const newYaml = yaml.dump(result.doc, {
        indent: 2,
        lineWidth: -1, // Don't wrap long lines
        noRefs: true,
        quotingType: '"'
      });
      
      fs.writeFileSync(filePath, newYaml, 'utf8');
      console.log(`Successfully updated ${targetFile}`);
    } else {
      console.log('Already sorted. No changes made.');
    }

  } catch (e) {
    console.error('Error processing YAML file:', e);
    process.exit(1);
  }
}

run();
