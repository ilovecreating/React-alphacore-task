import type { TreeNode } from '@alphacore/ui-kit';
import type { ApiTreeNode, TreeFilters } from '../types';

/** Map of alphacore tree node id → original API node (for displaying details) */
export const nodeDetailsMap = new Map<number, ApiTreeNode>();

/** Convert API tree to alphacore TreeNode format */
export function apiTreeToAlphacore(apiNodes: ApiTreeNode[]): TreeNode[] {
  nodeDetailsMap.clear();
  return apiNodes.map((node) => convertNode(node));
}

/** Filter API tree by is_assigned / in_library flags */
export function filterApiTree(nodes: ApiTreeNode[], filters: TreeFilters): ApiTreeNode[] {
  const hasAssignedFilter = filters.assignedYes || filters.assignedNo;
  const hasLibraryFilter = filters.libraryYes || filters.libraryNo;

  if (!hasAssignedFilter && !hasLibraryFilter) return nodes;

  function nodeMatches(node: ApiTreeNode): boolean {
    // Check assigned filter only on nodes that have a definite value
    if (hasAssignedFilter && node.is_assigned !== null) {
      const isAssigned = node.is_assigned;
      const accepted = (filters.assignedYes && isAssigned) || (filters.assignedNo && !isAssigned);
      if (!accepted) return false;
    }
    // Check library filter only on nodes that have a definite value
    if (hasLibraryFilter && node.in_library !== null) {
      const isInLibrary = node.in_library;
      const accepted = (filters.libraryYes && isInLibrary) || (filters.libraryNo && !isInLibrary);
      if (!accepted) return false;
    }
    return true;
  }

  function filterNode(node: ApiTreeNode): ApiTreeNode | null {
    const filteredChildren = node.children
      ? node.children.map(filterNode).filter((n): n is ApiTreeNode => n !== null)
      : null;

    const hasChildren = node.children && node.children.length > 0;
    const hasMatchingChildren = filteredChildren && filteredChildren.length > 0;
    const selfMatches = nodeMatches(node);

    // Parent/branch nodes: keep if they have matching descendants
    if (hasChildren) {
      if (!hasMatchingChildren) return null;
      return { ...node, children: filteredChildren };
    }

    // Leaf nodes: keep only if they match
    if (!selfMatches) return null;
    return { ...node, children: filteredChildren };
  }

  return nodes.map(filterNode).filter((n): n is ApiTreeNode => n !== null);
}

function convertNode(apiNode: ApiTreeNode): TreeNode {
  const numId = Number(apiNode.id);
  nodeDetailsMap.set(numId, apiNode);

  const result: TreeNode = {
    id: numId,
    name: apiNode.label || apiNode.name || '',
    customData: {
      description: apiNode.description,
      is_assigned: apiNode.is_assigned != null ? String(apiNode.is_assigned) : null,
      in_library: apiNode.in_library != null ? String(apiNode.in_library) : null,
    },
  };

  if (apiNode.children && apiNode.children.length > 0) {
    result.children = apiNode.children.map((child) => convertNode(child));
  }

  return result;
}
