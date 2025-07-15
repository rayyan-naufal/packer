import React, { useState, useRef, useEffect } from 'react';
import { Item } from '../types';
import { CATEGORY_COLORS, generateColorFromString } from '../constants';

interface DataItem {
  id: number;
  name: string;
}

interface ItemRowProps {
  item: Item;
  index: number;
  onUpdateItem: (id: number, updatedValues: { location?: string; category?: string }) => void;
  onEditItem: (item: Item) => void; // Prop baru untuk membuka modal edit
  onDeleteItem: (id: number) => void; // Prop baru untuk menghapus
  categories: DataItem[];
  locations: DataItem[];
}

type EditableField = 'category' | 'location' | null;

const ItemRow: React.FC<ItemRowProps> = ({ item, index, onUpdateItem, onEditItem, onDeleteItem, categories, locations }) => {
  const [editing, setEditing] = useState<EditableField>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [editing]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editing) {
      onUpdateItem(item.id, { [editing]: e.target.value as any });
      setEditing(null);
    }
  };
  
  const handleBlur = () => {
      setEditing(null);
  }

  const renderEditableCell = (field: 'category' | 'location') => {
    const isEditingThisCell = editing === field;
    const options = field === 'category' ? categories.map(c => c.name) : locations.map(l => l.name);
    const value = item[field];
    const colorClasses = field === 'category' 
      ? (CATEGORY_COLORS[item.category] || 'bg-gray-200') 
      : generateColorFromString(item.location);

    return (
      <td className="px-4 py-3 text-sm" onClick={() => !editing && setEditing(field)}>
        {isEditingThisCell ? (
          <select
            ref={selectRef}
            value={value}
            onChange={handleSelectChange}
            onBlur={handleBlur}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
          >
            {options.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <span className={`px-2 py-1 rounded-full font-medium cursor-pointer transition-transform duration-150 hover:scale-105 ${colorClasses}`}>
            {value}
          </span>
        )}
      </td>
    );
  };

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150">
      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{index + 1}</td>
      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
      {renderEditableCell('category')}
      {renderEditableCell('location')}
      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{item.note}</td>
      {/* Kolom Aksi Baru */}
      <td className="px-4 py-3 text-sm text-center">
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => onEditItem(item)} className="text-blue-500 hover:text-blue-700 font-semibold">Edit</button>
          <button onClick={() => onDeleteItem(item.id)} className="text-red-500 hover:text-red-700 font-semibold">Hapus</button>
        </div>
      </td>
    </tr>
  );
};

export default ItemRow;
