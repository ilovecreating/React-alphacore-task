import { Select } from '@alphacore/ui-kit';
import type { SelectOptionT } from '@alphacore/ui-kit';
import searchIcon from '../../assets/search.svg';
import type { TreeFilters } from '../../types';

import './SearchBar.css';

interface SearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  filters: TreeFilters;
  onFiltersChange: (filters: TreeFilters) => void;
}

export default function SearchBar({ searchText, onSearchChange, filters, onFiltersChange }: SearchBarProps) {
  const assignedOptions: SelectOptionT[] = [
    { value: 'yes', label: 'Да', checked: filters.assignedYes },
    { value: 'no', label: 'Нет', checked: filters.assignedNo },
  ];

  const libraryOptions: SelectOptionT[] = [
    { value: 'yes', label: 'Да', checked: filters.libraryYes },
    { value: 'no', label: 'Нет', checked: filters.libraryNo },
  ];

  const handleAssignedSelect = (selected: SelectOptionT) => {
    onFiltersChange({
      ...filters,
      assignedYes: selected.value === 'yes' ? true : filters.assignedYes,
      assignedNo: selected.value === 'no' ? true : filters.assignedNo,
    });
  };

  const handleAssignedRemove = (removed: SelectOptionT) => {
    onFiltersChange({
      ...filters,
      assignedYes: removed.value === 'yes' ? false : filters.assignedYes,
      assignedNo: removed.value === 'no' ? false : filters.assignedNo,
    });
  };

  const handleLibrarySelect = (selected: SelectOptionT) => {
    onFiltersChange({
      ...filters,
      libraryYes: selected.value === 'yes' ? true : filters.libraryYes,
      libraryNo: selected.value === 'no' ? true : filters.libraryNo,
    });
  };

  const handleLibraryRemove = (removed: SelectOptionT) => {
    onFiltersChange({
      ...filters,
      libraryYes: removed.value === 'yes' ? false : filters.libraryYes,
      libraryNo: removed.value === 'no' ? false : filters.libraryNo,
    });
  };

  return (
    <div className="search-bar">
      <Select
        options={assignedOptions}
        placeholder="Присвоенные"
        withCheckbox
        errorHidden
        onSelect={handleAssignedSelect}
        onRemove={handleAssignedRemove}
        className="search-bar-select"
      />
      <Select
        options={libraryOptions}
        placeholder="В библиотеке"
        withCheckbox
        errorHidden
        onSelect={handleLibrarySelect}
        onRemove={handleLibraryRemove}
        className="search-bar-select"
      />
      <div className="search-input-wrapper">
        <img src={searchIcon} alt="" className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Найти классы"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
