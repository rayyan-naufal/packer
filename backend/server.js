import React, { useState, useMemo, useEffect } from 'react';
import { Item, Location } from './types'; // Category tidak lagi diimpor dari sini
import { LogoIcon, LOCATIONS } from './constants';
import FilterControls from './components/FilterControls';
import ItemTable from './components/ItemTable';
import MoveItemsDialog from './components/MoveItemsDialog';

// Definisikan tipe baru untuk data kategori yang datang dari database
interface CategoryFromDB {
  id: number;
  name: string;
}

const App: React.FC = () => {
  // State untuk item dan kategori, awalnya array kosong
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<CategoryFromDB[]>([]);

  // State untuk filter
  const [categoryFilter, setCategoryFilter] = useState<string | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<Location | 'All'>('All');
  
  // State untuk dialog/modal
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  // Hook untuk mengambil data dari backend saat komponen pertama kali dimuat
  useEffect(() => {
    // 1. Ambil Kategori dari backend
    fetch('http://localhost:3001/api/categories')
      .then(res => res.json())
      .then(data => {
        console.log("Categories fetched:", data);
        setCategories(data);
      })
      .catch(err => console.error("Gagal mengambil kategori:", err));

    // 2. Ambil Items dari backend
    // CATATAN: Anda perlu membuat endpoint `/api/items` di backend Anda
    // Untuk sekarang, ini akan mengembalikan array kosong.
    // fetch('http://localhost:3001/api/items')
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log("Items fetched:", data);
    //     setItems(data);
    //   })
    //   .catch(err => console.error("Gagal mengambil item:", err));

  }, []); // Array dependensi kosong berarti hook ini hanya berjalan sekali

  // Fungsi ini perlu diupdate untuk berkomunikasi dengan backend
  const handleUpdateItem = (id: number, updatedValues: Partial<Item>) => {
    console.log(`Memperbarui item ${id} dengan`, updatedValues);
    // TODO: Kirim request PUT/PATCH ke backend di sini
    // Contoh: fetch(`/api/items/${id}`, { method: 'PUT', ... })

    // Untuk sementara, update state di frontend saja
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, ...updatedValues } : item
      )
    );
  };

  // Fungsi ini juga perlu diupdate untuk berkomunikasi dengan backend
  const handleMoveAllFromBag = (destination: Location) => {
    console.log(`Memindahkan semua item dari tas ke ${destination}`);
    // TODO: Kirim request ke backend untuk memindahkan banyak item
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.location === Location.Bag ? { ...item, location: destination } : item
      )
    );
    setIsMoveModalOpen(false);
  };

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
      const locationMatch = locationFilter === 'All' || item.location === locationFilter;
      return categoryMatch && locationMatch;
    });
  }, [items, categoryFilter, locationFilter]);

  // Memoized count of items in bag
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

      {/* Ini adalah bagian yang diperbaiki. Semua props ditulis lengkap. */}
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
