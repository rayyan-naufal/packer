
import React, { useState, useRef, useEffect } from 'react';
import { Item, Category, Location } from '../types';
import { CATEGORIES, LOCATIONS, CATEGORY_COLORS, LOCATION_COLORS } from '../constants';

interface ItemRowProps {
  item: Item;
  index: number;
  onUpdateItem: (id: number, updatedValues: Partial<Item>) => void;
}

type EditableField = 'category' | 'location' | null;

const ItemRow: React.FC<ItemRowProps> = ({ item, index, onUpdateItem }) => {
  const [editing, setEditing] = useState<EditableField>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [editing]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editing) {
      onUpdateItem(item.id, { [editing]: e.target.value });
      setEditing(null);
    }
  };
  
  const handleBlur = () => {
      setEditing(null);
  }

  const renderEditableCell = (field: 'category' | 'location') => {
    const isEditingThisCell = editing === field;
    const options = field === 'category' ? CATEGORIES : LOCATIONS;
    const value = item[field];
    const colorClasses = field === 'category' ? CATEGORY_COLORS[item.category] : LOCATION_COLORS[item.location];

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
    </tr>
  );
};

export default ItemRow;
