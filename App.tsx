import React, { useState, useMemo, useEffect } from 'react';
import { Item, Location } from './types';
import { LogoIcon, LOCATIONS } from './constants';
import FilterControls from './components/FilterControls';
import ItemTable from './components/ItemTable';
import MoveItemsDialog from './components/MoveItemsDialog';

interface CategoryFromDB {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<CategoryFromDB[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<Location | 'All'>('All');
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Gagal mengambil kategori:", err));
  }, []);

  const handleUpdateItem = (id: number, updatedValues: Partial<Item>) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, ...updatedValues } : item
      )
    );
  };

  const handleMoveAllFromBag = (destination: Location) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.location === Location.Bag ? { ...item, location: destination } : item
      )
    );
    setIsMoveModalOpen(false);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
      const locationMatch = locationFilter === 'All' || item.location === locationFilter;
      return categoryMatch && locationMatch;
    });
  }, [items, categoryFilter, locationFilter]);

  const itemsInBagCount = useMemo(() => {
    return items.filter(item => item.location === Location.Bag).length;
  }, [items]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
                <LogoIcon />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Student Packer
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Track your essentials between dorm and home. Click on a category or location in the table to change it.
          </p>
        </header>

        <main>
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6">
            <FilterControls
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              onMoveAllFromBagClick={() => setIsMoveModalOpen(true)}
              itemsInBagCount={itemsInBagCount}
              categories={categories}
            />
            <div className="mt-6">
              <ItemTable
                items={filteredItems}
                onUpdateItem={handleUpdateItem}
                categories={categories}
              />
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            <p>Built for students, by a student (of React).</p>
        </footer>
      </div>
      
      <MoveItemsDialog
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onConfirm={handleMoveAllFromBag}
        itemCount={itemsInBagCount}
        locations={LOCATIONS}
      />
    </div>
  );
};

export default App;