import React, { useState, useRef, useEffect } from 'react';
import { Item } from '../types';
import { CATEGORY_COLORS, LOCATION_COLORS } from '../constants';

interface ItemRowProps {
  item: Item;
  index: number;
  onUpdateItem: (id: number, updatedValues: Partial<Item>) => void;
  categories: { id: number; name: string }[];
}

const ItemRow: React.FC<ItemRowProps> = ({ item, index, onUpdateItem, categories }) => {
  // Untuk sementara, fungsionalitas edit kita sederhanakan
  const colorClassesCategory = CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-800';
  const colorClassesLocation = LOCATION_COLORS[item.location] || 'bg-gray-100 text-gray-800';

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150">
      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{index + 1}</td>
      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full font-medium ${colorClassesCategory}`}>
          {item.category}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full font-medium ${colorClassesLocation}`}>
          {item.location}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{item.note}</td>
    </tr>
  );
};

export default ItemRow;
