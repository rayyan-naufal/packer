// packer-master/components/ItemRow.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Item, Location } from '../types';
// Hapus import CATEGORIES
import { LOCATIONS, CATEGORY_COLORS, LOCATION_COLORS } from '../constants';

interface ItemRowProps {
  item: Item;
  index: number;
  onUpdateItem: (id: number, updatedValues: Partial<Item>) => void;
  categories: { id: number; name: string }[]; // <-- Terima props categories
}

// ...

const ItemRow: React.FC<ItemRowProps> = ({ item, index, onUpdateItem, categories }) => {
  // ... state tidak berubah

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editing) {
      // Kirim nama kategori, bukan objek utuh
      onUpdateItem(item.id, { [editing]: e.target.value });
      setEditing(null);
    }
  };

  // ...

  const renderEditableCell = (field: 'category' | 'location') => {
    const isEditingThisCell = editing === field;
    // Gunakan 'categories' dari props jika field adalah 'category'
    const options = field === 'category' ? categories.map(c => c.name) : LOCATIONS;
    const value = item[field];

    // Logika warna mungkin perlu disesuaikan karena tidak lagi berbasis enum
    const colorClasses = field === 'category' ? (CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-800') : LOCATION_COLORS[item.location];

    return (
      <td className="px-4 py-3 text-sm" onClick={() => !editing && setEditing(field)}>
        {isEditingThisCell ? (
          <select
            ref={selectRef}
            value={value}
            onChange={handleSelectChange}
            onBlur={() => setEditing(null)}
            className="..."
          >
            {/* Render options dari array yang sesuai */}
            {options.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <span className={`px-2 py-1 rounded-full font-medium cursor-pointer ... ${colorClasses}`}>
            {value}
          </span>
        )}
      </td>
    );
  };

  // ... sisa komponen tidak berubah
};

export default ItemRow;