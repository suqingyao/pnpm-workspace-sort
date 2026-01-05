import { describe, it, expect } from 'vitest';
import { sortWorkspaceData, WorkspaceData } from '../src/index.js';

describe('sortWorkspaceData', () => {
  it('should sort packages alphabetically', () => {
    const input: WorkspaceData = {
      packages: ['b', 'a', 'c']
    };
    const { doc, changed, changes } = sortWorkspaceData(input);
    
    expect(changed).toBe(true);
    expect(doc.packages).toEqual(['a', 'b', 'c']);
    expect(changes).toContain('Sorted packages.');
  });

  it('should sort catalog dependencies alphabetically', () => {
    const input: WorkspaceData = {
      catalog: {
        z: '1.0.0',
        a: '2.0.0',
        m: '3.0.0'
      }
    };
    const { doc, changed, changes } = sortWorkspaceData(input);

    expect(changed).toBe(true);
    expect(Object.keys(doc.catalog!)).toEqual(['a', 'm', 'z']);
    expect(changes).toContain('Sorted catalog dependencies.');
  });

  it('should sort named catalogs and their dependencies', () => {
    const input: WorkspaceData = {
      catalogs: {
        front: {
          z: '1',
          a: '2'
        },
        back: {
          x: '1'
        }
      }
    };
    const { doc, changed, changes } = sortWorkspaceData(input);

    expect(changed).toBe(true);
    // Check catalogs order (keys)
    expect(Object.keys(doc.catalogs!)).toEqual(['back', 'front']);
    // Check dependencies order inside catalog
    expect(Object.keys(doc.catalogs!.front)).toEqual(['a', 'z']);
    expect(changes).toContain('Sorted named catalogs dependencies.');
  });

  it('should handle multiple sections sorting', () => {
    const input: WorkspaceData = {
      packages: ['y', 'x'],
      catalog: { b: '1', a: '1' }
    };
    const { doc, changed, changes } = sortWorkspaceData(input);

    expect(changed).toBe(true);
    expect(doc.packages).toEqual(['x', 'y']);
    expect(Object.keys(doc.catalog!)).toEqual(['a', 'b']);
    expect(changes).toHaveLength(2);
  });

  it('should return false if already sorted', () => {
    const input: WorkspaceData = {
      packages: ['a', 'b'],
      catalog: { a: '1', b: '1' }
    };
    const { changed, changes } = sortWorkspaceData(input);

    expect(changed).toBe(false);
    expect(changes).toHaveLength(0);
  });

  it('should handle empty or missing sections safely', () => {
    const input: WorkspaceData = {
      other: 'field'
    };
    const { changed } = sortWorkspaceData(input);
    expect(changed).toBe(false);
  });
});
