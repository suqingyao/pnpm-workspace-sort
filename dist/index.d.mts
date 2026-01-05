declare const sortObject: (obj: any) => any;
interface WorkspaceData {
    packages?: string[];
    catalog?: Record<string, string>;
    catalogs?: Record<string, Record<string, string>>;
    [key: string]: any;
}
interface SortResult {
    doc: WorkspaceData;
    changed: boolean;
    changes: string[];
}
declare function sortWorkspaceData(doc: WorkspaceData): SortResult;

export { type SortResult, type WorkspaceData, sortObject, sortWorkspaceData };
