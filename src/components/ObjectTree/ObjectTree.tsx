import { useState, useEffect, useCallback } from 'react';
import { Tree, Button, useSearchNode, useToggleAllNodes, getAllDescendants } from '@alphacore/ui-kit';
import type { TreeNode } from '@alphacore/ui-kit';

import './ObjectTree.css';

interface ObjectTreeProps {
  data: TreeNode[];
  searchText: string;
  onSelectNode: (node: TreeNode) => void;
}

export default function ObjectTree({ data, searchText, onSelectNode }: ObjectTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);

  const { filteredTree, setSearchTerm } = useSearchNode({
    treeData: data,
    setExpandedNodes,
  });

  const { toggleExpandAll } = useToggleAllNodes({
    treeData: data,
    setExpandedNodes,
  });

  useEffect(() => {
    setSearchTerm(searchText);
  }, [searchText, setSearchTerm]);

  const handleSelectNode = useCallback((node: TreeNode, checked?: boolean) => {
    if (checked !== undefined) {
      // Checkbox click: toggle this node + all descendants
      const descendantIds = getAllDescendants(node);
      const idsToToggle = [node.id, ...descendantIds];

      setSelectedNodeIds((prev) => {
        if (checked) {
          const set = new Set(prev);
          idsToToggle.forEach((id) => set.add(id));
          return Array.from(set);
        } else {
          const removeSet = new Set(idsToToggle);
          return prev.filter((id) => !removeSet.has(id));
        }
      });
    }
    // Always show details for clicked node
    onSelectNode(node);
  }, [onSelectNode]);

  const treeData = searchText ? filteredTree : data;

  return (
    <div className="object-tree">
      <div className="tree-toolbar">
        <Button variant="clear" className="tree-toolbar-btn" onClick={() => toggleExpandAll(false)}>
          Свернуть все
        </Button>
        <Button variant="clear" className="tree-toolbar-btn" onClick={() => toggleExpandAll(true)}>
          Развернуть все
        </Button>
      </div>
      <div className="tree-content">
        <Tree
          treeData={treeData}
          expandedNodes={expandedNodes}
          setExpandedNodes={setExpandedNodes}
          onSelectNode={handleSelectNode}
          selectedNodeIds={selectedNodeIds}
          withCheckbox
          clearParent
        />
      </div>
    </div>
  );
}
