# pnpm-workspace-sort

A CLI tool to automatically sort `packages` and `catalog` dependencies in `pnpm-workspace.yaml`.

## Features

- Sorts `packages` list alphabetically.
- Sorts `catalog` dependencies alphabetically.
- Sorts named `catalogs` dependencies alphabetically.
- Auto-detects `pnpm-workspace.yaml` in the current directory.

## Usage

### Without Installation (Recommended)

You can run this tool directly using `npx` without installing it:

```bash
npx pnpm-workspace-sort
```

### Installation

If you prefer to install it globally:

```bash
npm install -g pnpm-workspace-sort
pnpm-workspace-sort
```

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run locally:
   ```bash
   node index.js
   ```

## Publishing

To make this tool available via `npx pnpm-workspace-sort`, you need to publish it to npm:

```bash
npm publish
```
