import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Item, Location } from './types';
import { LogoIcon, LOCATIONS } from './constants';
import FilterControls from './components/FilterControls';
import { ItemTable } from './components/ItemTable';
import MoveItemsDialog from './components/MoveItemsDialog';
import { AddItemForm } from './components/AddItemForm'; // Import form baru

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
  const [showAddForm, setShowAddForm] = useState(false); // State untuk menampilkan form

  // Gunakan useCallback agar fungsi ini tidak dibuat ulang setiap render
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
    // Ambil kategori
    fetch('http://localhost:3001/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Gagal mengambil kategori:", err));
    
    // Ambil item
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async (itemData: { name: string; category_id: number; location: Location; note: string }) => {
    try {
      const response = await fetch('http://localhost:3001/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) {
        throw new Error('Gagal menambahkan barang');
      }
      // Tambahkan item baru ke state tanpa perlu fetch ulang semua data
      const newItem = await response.json();
      setItems(currentItems => [...currentItems, newItem]);
      setShowAddForm(false); // Sembunyikan form setelah berhasil
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menambahkan barang.');
    }
  };

  const handleUpdateItem = (id: number, updatedValues: Partial<Item>) => {
    // TODO: Implementasi update ke backend
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, ...updatedValues } : item
      )
    );
  };

  const handleMoveAllFromBag = (destination: Location) => {
    // TODO: Implementasi update ke backend
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
          {/* ... bagian header tidak berubah ... */}
        </header>

        <main>
          {/* Tombol untuk menampilkan form tambah barang */}
          {!showAddForm && (
            <div className="mb-6 text-right">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-5 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 bg-blue-600 text-white shadow-md hover:bg-blue-700"
              >
                + Tambah Barang Baru
              </button>
            </div>
          )}

          {/* Tampilkan form jika showAddForm adalah true */}
          {showAddForm && (
            <AddItemForm
              categories={categories}
              onAddItem={handleAddItem}
              onCancel={() => setShowAddForm(false)}
            />
          )}

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
