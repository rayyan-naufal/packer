// packer-master/components/FilterControls.tsx
import React from 'react';
import { Location } from '../types';
// Hapus import CATEGORIES, kita akan terima dari props
import { LOCATIONS } from '../constants'; 

// Definisikan tipe untuk kategori yang diterima
interface CategoryFromDB {
  id: number;
  name: string;
}

interface FilterControlsProps {
  categoryFilter: string | 'All'; // Ubah tipe jadi string
  setCategoryFilter: (filter: string | 'All') => void;
  locationFilter: Location | 'All';
  setLocationFilter: (filter: Location | 'All') => void;
  onMoveAllFromBagClick: () => void;
  itemsInBagCount: number;
  categories: CategoryFromDB[]; // Terima 'categories' sebagai props
}

// ... komponen FilterButton tidak berubah ...
const FilterButton: React.FC<...> = ({...}) => {...};


const FilterControls: React.FC<FilterControlsProps> = ({
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter,
  onMoveAllFromBagClick,
  itemsInBagCount,
  categories // Ambil dari props
}) => {
  return (
    <div className="space-y-6 md:space-y-0 md:flex md:justify-between md:items-start md:gap-8">
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Category</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="All" isActive={categoryFilter === 'All'} onClick={() => setCategoryFilter('All')} />
            {/* Gunakan data 'categories' dari props untuk membuat tombol secara dinamis */}
            {categories.map(cat => (
              <FilterButton key={cat.id} label={cat.name} isActive={categoryFilter === cat.name} onClick={() => setCategoryFilter(cat.name)} />
            ))}
          </div>
        </div>
        {/* ... sisa komponen tidak berubah ... */}
      </div>
    </div>
  );
};

export default FilterControls;