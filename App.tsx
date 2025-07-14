// packer-master/App.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Item, Location } from './types'; // Category tidak diimpor lagi
import { /* INITIAL_ITEMS, */ LogoIcon, LOCATIONS } from './constants'; // Hapus INITIAL_ITEMS
import FilterControls from './components/FilterControls';
import ItemTable from './components/ItemTable';
import MoveItemsDialog from './components/MoveItemsDialog';

// Definisikan tipe baru untuk data kategori yang datang dari database
interface CategoryFromDB {
  id: number;
  name: string;
}

const App: React.FC = () => {
  // Ganti INITIAL_ITEMS dengan array kosong sebagai state awal
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<CategoryFromDB[]>([]);

  const [categoryFilter, setCategoryFilter] = useState<string | 'All'>('All'); // Ubah tipe jadi string
  const [locationFilter, setLocationFilter] = useState<Location | 'All'>('All');
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  // useEffect untuk mengambil data dari backend saat komponen pertama kali dimuat
  useEffect(() => {
    // 1. Ambil Kategori
    fetch('http://localhost:3001/api/categories')
      .then(res => res.json())
      .then(data => {
        console.log("Categories fetched:", data);
        setCategories(data);
      })
      .catch(err => console.error("Gagal mengambil kategori:", err));

    // 2. Anda juga perlu membuat endpoint untuk mengambil Items.
    // Untuk sekarang, kita bisa biarkan item kosong atau buat endpoint /api/items
    // fetch('http://localhost:3001/api/items')...
  }, []); // Array kosong berarti hook ini hanya berjalan sekali saat mount

  const handleUpdateItem = (id: number, updatedValues: Partial<Item>) => {
    // TODO: Fungsi ini sekarang harus mengirim request PUT ke backend
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, ...updatedValues } : item
      )
    );
  };

  const handleMoveAllFromBag = (destination: Location) => {
    // TODO: Fungsi ini juga perlu interaksi backend
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
        {/* ... bagian header tidak berubah ... */}
        <header>
            ...
        </header>

        <main>
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6">
            {/* Teruskan 'categories' sebagai props ke FilterControls */}
            <FilterControls
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              onMoveAllFromBagClick={() => setIsMoveModalOpen(true)}
              itemsInBagCount={itemsInBagCount}
              categories={categories} // <-- PROPS BARU
            />
            <div className="mt-6">
              {/* Teruskan 'categories' sebagai props ke ItemTable */}
              <ItemTable
                items={filteredItems}
                onUpdateItem={handleUpdateItem}
                categories={categories} // <-- PROPS BARU
              />
            </div>
          </div>
        </main>
        
        {/* ... bagian footer & dialog tidak berubah ... */}
        <footer>...</footer>
        <MoveItemsDialog ... />
      </div>
    </div>
  );
};

export default App;