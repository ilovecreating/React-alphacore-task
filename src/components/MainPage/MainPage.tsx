import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { Loader } from '@alphacore/ui-kit';
import type { TreeNode } from '@alphacore/ui-kit';
import '@alphacore/ui-kit/dist/styles/index.css';
import type { ApiTreeNode, TreeFilters } from '../../types';
import { GET_TREE } from '../../graphql/operations';
import { apiTreeToAlphacore, nodeDetailsMap, filterApiTree } from '../../services/treeAdapter';
import SearchBar from '../SearchBar/SearchBar';
import ObjectTree from '../ObjectTree/ObjectTree';
import ObjectDetails from '../ObjectDetails/ObjectDetails';
import './MainPage.css';

const defaultFilters: TreeFilters = {
  assignedYes: false,
  assignedNo: false,
  libraryYes: false,
  libraryNo: false,
};

export default function MainPage() {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<TreeFilters>(defaultFilters);
  const [selectedApiNode, setSelectedApiNode] = useState<ApiTreeNode | null>(null);

  const { data, loading, error } = useQuery<{ tree: ApiTreeNode }>(GET_TREE);

  const treeNodes = useMemo(() => {
    if (!data?.tree) return [];
    const filtered = filterApiTree([data.tree], filters);
    return apiTreeToAlphacore(filtered);
  }, [data, filters]);

  const handleSelectNode = (node: TreeNode) => {
    const apiNode = nodeDetailsMap.get(node.id);
    setSelectedApiNode(apiNode || null);
  };

  return (
    <div className="main-page">
      <div className="top-bar">
        <span className="top-bar-title">Классы</span>
        <div className="top-bar-right">
          <SearchBar
            searchText={searchText}
            onSearchChange={setSearchText}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>
      <div className="main-content">
        <aside className="sidebar">
          {loading && <div className="loading"><Loader size={32} /></div>}
          {error && <div className="error-msg">Ошибка загрузки: {error.message}</div>}
          {!loading && !error && (
            <ObjectTree
              data={treeNodes}
              searchText={searchText}
              onSelectNode={handleSelectNode}
            />
          )}
        </aside>
        <main className="details-panel">
          <ObjectDetails node={selectedApiNode} />
        </main>
      </div>
    </div>
  );
}
