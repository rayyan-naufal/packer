import React from 'react';
import { Item } from '../types';
import ItemRow from './ItemRow';

// Definisikan tipe untuk konfigurasi sorting
type SortConfig = {
  key: keyof Item | '#';
  direction: 'ascending' | 'descending';
};

interface ItemTableProps {
  items: Item[];
  onUpdateItem: (id: number, updatedValues: Partial<Item>) => void;
  categories: { id: number; name: string }[];
  requestSort: (key: keyof Item | '#') => void;
  sortConfig: SortConfig | null;
}

// Komponen untuk header yang bisa di-sort
const SortableHeader: React.FC<{
  label: string;
  sortKey: keyof Item | '#';
  requestSort: (key: keyof Item | '#') => void;
  sortConfig: SortConfig | null;
  className?: string;
}> = ({ label, sortKey, requestSort, sortConfig, className = "" }) => {
  const isSorted = sortConfig?.key === sortKey;
  const directionIcon = sortConfig?.direction === 'ascending' ? '▲' : '▼';

  return (
    <th className={`px-4 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400 ${className}`}>
      <button 
        onClick={() => requestSort(sortKey)} 
        className="flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        {label}
        {isSorted && <span className="text-xs">{directionIcon}</span>}
      </button>
    </th>
  );
};

export const ItemTable: React.FC<ItemTableProps> = ({ items, onUpdateItem, categories, requestSort, sortConfig }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-slate-200 dark:border-slate-700">
          <tr>
            <SortableHeader label="#" sortKey="#" requestSort={requestSort} sortConfig={sortConfig} className="w-16" />
            <th className="px-4 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400">Item</th>
            <SortableHeader label="Category" sortKey="category" requestSort={requestSort} sortConfig={sortConfig} />
            <SortableHeader label="Location" sortKey="location" requestSort={requestSort} sortConfig={sortConfig} />
            <th className="px-4 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400">Note</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <ItemRow key={item.id} item={item} index={index} onUpdateItem={onUpdateItem} categories={categories} />
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <p>Tidak ada barang yang cocok dengan filter saat ini.</p>
          </div>
      )}
    </div>
  );
};
