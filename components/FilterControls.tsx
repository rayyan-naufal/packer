import React from 'react';

// Definisikan tipe untuk data yang diterima
interface FilterControlsProps {
  categoryFilter: string | 'All';
  setCategoryFilter: (filter: string | 'All') => void;
  locationFilter: string | 'All';
  setLocationFilter: (filter: string | 'All') => void;
  onMoveAllFromBagClick: () => void;
  itemsInBagCount: number;
  categories: string[]; // Terima array of strings
  locations: string[];  // Terima array of strings
}

const FilterButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => {
    const baseClasses = 'px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500';
    const activeClasses = 'bg-blue-600 text-white shadow-md';
    const inactiveClasses = 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600';
    
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {label}
        </button>
    );
};


const FilterControls: React.FC<FilterControlsProps> = ({
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter,
  onMoveAllFromBagClick,
  itemsInBagCount,
  categories,
  locations // Ambil dari props
}) => {
  return (
    <div className="space-y-6 md:space-y-0 md:flex md:justify-between md:items-start md:gap-8">
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Category</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="All" isActive={categoryFilter === 'All'} onClick={() => setCategoryFilter('All')} />
            {categories.map(cat => (
              <FilterButton key={cat} label={cat} isActive={categoryFilter === cat} onClick={() => setCategoryFilter(cat)} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Location</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="All" isActive={locationFilter === 'All'} onClick={() => setLocationFilter('All')} />
            {/* Gunakan data 'locations' dari props */}
            {locations.map(loc => (
              <FilterButton key={loc} label={loc} isActive={locationFilter === loc} onClick={() => setLocationFilter(loc)} />
            ))}
          </div>
        </div>
      </div>
      <div className="md:border-l md:border-slate-200 md:dark:border-slate-700 md:pl-6">
        <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Actions</h3>
        <button
          onClick={onMoveAllFromBagClick}
          disabled={itemsInBagCount === 0}
          aria-label={`Move ${itemsInBagCount} items from Bag`}
          className="w-full md:w-auto px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-rose-500 bg-rose-600 text-white shadow-md hover:bg-rose-700 disabled:bg-slate-400 disabled:text-slate-200 disabled:cursor-not-allowed dark:disabled:bg-slate-600 dark:disabled:text-slate-400"
        >
          Move All from Bag ({itemsInBagCount})
        </button>
      </div>
    </div>
  );
};

export default FilterControls;
