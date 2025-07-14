import React, { useState, useMemo, useEffect, useCallback } from 'react';
// Perhatikan path yang sudah diperbaiki di sini
import { Item, Location } from './types'; 
import { LogoIcon, LOCATIONS } from './constants';
import FilterControls from './components/FilterControls';
import { ItemTable } from './components/ItemTable';
import MoveItemsDialog from './components/MoveItemsDialog';
import { AddItemForm } from './components/AddItemForm';

interface CategoryFromDB {
  id: number;
  name: string;
}

// Definisikan tipe untuk konfigurasi sorting
type SortConfig = {
  key: keyof Item | '#';
  direction: 'ascending' | 'descending';
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<CategoryFromDB[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<Location | 'All'>('All');
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: '#', direction: 'ascending' });

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/items');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error("Gagal mengambil item:", err);
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Gagal mengambil kategori:", err));
    
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async (itemData: { name: string; category_id: number; location: Location; note: string }) => {
    try {
      await fetch('http://localhost:3001/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      await fetchItems();
      setShowAddForm(false);
    } catch (err) {
      alert('Terjadi kesalahan saat menambahkan barang.');
    }
  };

  const handleUpdateItem = async (id: number, updatedValues: { location?: Location; category?: string }) => {
    let body = {};
    if (updatedValues.location) {
        body = { location: updatedValues.location };
    } else if (updatedValues.category) {
        const category = categories.find(c => c.name === updatedValues.category);
        if (category) { body = { category_id: category.id }; }
    }
    if (Object.keys(body).length > 0) {
        try {
            await fetch(`http://localhost:3001/api/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            await fetchItems();
        } catch (err) {
            alert('Terjadi kesalahan saat mengedit barang.');
        }
    }
  };

  const handleMoveAllFromBag = async (destination: Location) => {
    try {
        await fetch('http://localhost:3001/api/items/move-all-from-bag', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destination }),
        });
        await fetchItems();
        setIsMoveModalOpen(false);
    } catch (err) {
        alert('Terjadi kesalahan saat memindahkan barang.');
    }
  };

  const requestSort = (key: keyof Item | '#') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // === BLOK LOGIKA DIPERBAIKI DI SINI ===
  const processedItems = useMemo(() => {
    // 1. Filter data
    let processableItems = items.filter(item => {
      const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
      const locationMatch = locationFilter === 'All' || item.location === locationFilter;
      return categoryMatch && locationMatch;
    });

    // 2. Urutkan data yang sudah difilter
    if (sortConfig !== null) {
      // Buat salinan array sebelum diurutkan untuk menghindari mutasi
      processableItems = [...processableItems].sort((a, b) => {
        // Jika key bukan '#', lakukan pengurutan alfabetis/numerik
        if (sortConfig.key !== '#') {
          const key = sortConfig.key as keyof Item; // Pastikan key adalah properti dari Item
          if (a[key] < b[key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[key] > b[key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
        }
        return 0;
      });
    }
    
    // 3. Jika sort by # descending, kita reverse array yang sudah difilter
    // (Urutan ascending by # adalah urutan default dari database)
    if (sortConfig?.key === '#' && sortConfig.direction === 'descending') {
        return processableItems.reverse();
    }

    return processableItems;
  }, [items, categoryFilter, locationFilter, sortConfig]);


  const itemsInBagCount = useMemo(() => {
    return items.filter(item => item && item.location === Location.Bag).length;
  }, [items]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg"><LogoIcon /></div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Packer</h1>
          </div>
        </header>

        <main>
          {!showAddForm && (
            <div className="mb-6 text-right">
              <button onClick={() => setShowAddForm(true)} className="px-5 py-2.5 text-sm font-semibold rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700">
                + Tambah Barang Baru
              </button>
            </div>
          )}
          {showAddForm && <AddItemForm categories={categories} onAddItem={handleAddItem} onCancel={() => setShowAddForm(false)} />}

          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 mt-6">
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
                items={processedItems} 
                onUpdateItem={handleUpdateItem} 
                categories={categories}
                requestSort={requestSort}
                sortConfig={sortConfig}
              />
            </div>
          </div>
        </main>
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
