
import React from 'react';
import { Item } from '../types';
import ItemRow from './ItemRow';

interface ItemTableProps {
  items: Item[];
  onUpdateItem: (id: number, updatedValues: Partial<Item>) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onUpdateItem }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400 w-16">#</th>
            <th className="px-4 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400">Item</th>
            <th className="px-4 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400">Category</th>
            <th className="px-4 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400">Location</th>
            <th className="px-4 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400">Note</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <ItemRow key={item.id} item={item} index={index} onUpdateItem={onUpdateItem} />
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <p>No items match the current filters.</p>
          </div>
      )}
    </div>
  );
};

export default ItemTable;
