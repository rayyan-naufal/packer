import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Item, Location } from './types';
import { LogoIcon } from './constants';
import { ItemTable } from './components/ItemTable';
import FilterControls from './components/FilterControls'; // Import FilterControls

// Tipe data untuk kategori dari DB
interface CategoryFromDB {
  id: number;
  name: string;
}

const App: React.FC = () => {
  // State untuk data mentah dari server
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<CategoryFromDB[]>([]);
  
  // State untuk filter, kita tambahkan kembali
  const [categoryFilter, setCategoryFilter] = useState<string | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<Location | 'All'>('All');

  // Fungsi untuk mengambil data item
  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/items');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data item berhasil diambil:", data);
      setItems(data);
    } catch (err) {
      console.error("Gagal total mengambil item:", err);
    }
  }, []);

  // useEffect untuk mengambil data saat aplikasi pertama kali dimuat
  useEffect(() => {
    fetch('http://localhost:3001/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Gagal mengambil kategori:", err));
    
    fetchItems();
  }, [fetchItems]);

  // Logika filter kita kembalikan menggunakan useMemo
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (!item) return false; // Pengaman
      const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
      const locationMatch = locationFilter === 'All' || item.location === locationFilter;
      return categoryMatch && locationMatch;
    });
  }, [items, categoryFilter, locationFilter]);

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
            Daftar Barang dari Database
          </p>
        </header>

        <main>
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 mt-6">
            
            {/* Komponen FilterControls kita tambahkan kembali */}
            <FilterControls
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              // Untuk sementara, kita berikan nilai dummy untuk props yang belum terpakai
              onMoveAllFromBagClick={() => {}}
              itemsInBagCount={0}
              categories={categories}
            />

            <div className="mt-6">
              {/* Sekarang kita berikan 'filteredItems' ke tabel */}
              <ItemTable
                items={filteredItems}
                onUpdateItem={() => {}}
                categories={categories}
              />
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            <p>Dibuat untuk mahasiswa, oleh seorang mahasiswa (React).</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
