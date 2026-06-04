import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';

import { SORT_OPTIONS } from '@/constants/api';
import { SortField, SortOrder } from '@/types/sorting';

interface Props {
  sortBy:      SortField;
  sortOrder:   SortOrder;
  onSortBy:    (value: SortField) => void;
  onSortOrder: () => void;
}

const SortControls = ({ sortBy, sortOrder, onSortBy, onSortOrder }: Props) => (
  <div className='flex items-center gap-1.5'>
    <span className='text-xs text-quaternary-400 dark:text-gray-500'>Sort by:</span>
    <select value={sortBy} onChange={event => onSortBy(event.target.value as SortField)}
      className='rounded-lg border border-quaternary-200 bg-white px-2 py-1 text-xs text-quaternary-600 outline-none transition-colors hover:border-quaternary-300 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-gray-500'>
      {SORT_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    <button onClick={onSortOrder} title={sortOrder === SortOrder.Asc ? 'Ascending' : 'Descending'}
      className='flex h-7 w-7 items-center justify-center rounded-lg border border-quaternary-200 text-quaternary-500 transition-colors hover:bg-quaternary-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'>
      {sortOrder === SortOrder.Asc ? <ArrowUpNarrowWide className='h-3.5 w-3.5' /> : <ArrowDownNarrowWide className='h-3.5 w-3.5' />}
    </button>
  </div>
);

export default SortControls;
