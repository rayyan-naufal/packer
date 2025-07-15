import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Item } from './types';
import { LogoIcon } from './constants';
import FilterControls from './components/FilterControls';
import { ItemTable } from './components/ItemTable';
import MoveItemsDialog from './components/MoveItemsDialog';
import { AddItemForm } from './components/AddItemForm';
import { SettingsPage } from './components/SettingsPage';
import EditItemDialog from './components/EditItemDialog'; // Import modal edit baru

// Tipe data umum untuk Kategori dan Lokasi
interface DataItem {
  id: number;
  name: string;
}

// Tipe untuk membedakan tampilan
type View = 'main' | 'settings';

// Definisikan tipe untuk konfigurasi sorting
type SortConfig = {
  key: keyof Item | '#';
  direction: 'ascending' | 'descending';
};

const App: React.FC = () => {
  // --- STATE UNTUK DATA ---
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<DataItem[]>([]);
  const [locations, setLocations] = useState<DataItem[]>([]);
  
  // --- STATE UNTUK UI ---
  const [view, setView] = useState<View>('main');
  const [categoryFilter, setCategoryFilter] = useState<string | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<string | 'All'>('All');
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: '#', direction: 'ascending' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);


  // --- FUNGSI UNTUK MENGAMBIL DATA ---
  const fetchAllData = useCallback(async () => {
    try {
      const [itemsRes, catRes, locRes] = await Promise.all([
        fetch('http://localhost:3001/api/items'),
        fetch('http://localhost:3001/api/categories'),
        fetch('http://localhost:3001/api/locations'),
      ]);
      const itemsData = await itemsRes.json();
      const catData = await catRes.json();
      const locData = await locRes.json();
      setItems(itemsData);
      setCategories(catData);
      setLocations(locData);
    } catch (err) {
      console.error("Gagal mengambil semua data:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- HANDLER UNTUK SEMUA AKSI API ---
  const handleApiAction = async (url: string, options: RequestInit) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memproses respons error' }));
            throw new Error(errorData.message);
        }
        await fetchAllData();
    } catch (err) {
        alert('Terjadi kesalahan: ' + (err as Error).message);
    }
  };

  const handleCategoryUpdate = (action: 'add' | 'update' | 'delete', data: { id?: number, name?: string }) => {
    const { id, name } = data;
    let url = 'http://localhost:3001/api/categories';
    let options: RequestInit = {
        method: action === 'add' ? 'POST' : (action === 'update' ? 'PUT' : 'DELETE'),
        headers: { 'Content-Type': 'application/json' },
    };
    if (action === 'update' || action === 'delete') url += `/${id}`;
    if (action !== 'delete') options.body = JSON.stringify({ name });
    handleApiAction(url, options);
  };
  
  const handleLocationUpdate = (action: 'add' | 'update' | 'delete', data: { id?: number, name?: string }) => {
    const { id, name } = data;
    let url = 'http://localhost:3001/api/locations';
    let options: RequestInit = {
        method: action === 'add' ? 'POST' : (action === 'update' ? 'PUT' : 'DELETE'),
        headers: { 'Content-Type': 'application/json' },
    };
    if (action === 'update' || action === 'delete') url += `/${id}`;
    if (action !== 'delete') options.body = JSON.stringify({ name });
    handleApiAction(url, options);
  };
  
  const handleAddItem = async (itemData: { name: string; category_id: number; location_id: number; note: string }) => {
    await handleApiAction('http://localhost:3001/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
    });
    setShowAddForm(false);
  };
  
  const handleUpdateItem = async (id: number, updatedValues: { location?: string; category?: string }) => {
    let body = {};
    if (updatedValues.location) {
        const location = locations.find(l => l.name === updatedValues.location);
        if (location) body = { location_id: location.id };
    } else if (updatedValues.category) {
        const category = categories.find(c => c.name === updatedValues.category);
        if (category) body = { category_id: category.id };
    }
    if (Object.keys(body).length > 0) {
        await handleApiAction(`http://localhost:3001/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    }
  };

  const handleMoveAllFromBag = async (destination: string) => {
    await handleApiAction('http://localhost:3001/api/items/move-all-from-bag', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination }),
    });
    setIsMoveModalOpen(false);
  };

  // Handler baru untuk menghapus item
  const handleDeleteItem = async (id: number) => {
    // Menggunakan window.confirm untuk konfirmasi dari pengguna
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        await handleApiAction(`http://localhost:3001/api/items/${id}`, { method: 'DELETE' });
    }
  };

  // Handler baru untuk membuka modal edit
  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  // Handler baru untuk menyimpan perubahan dari modal edit
  const handleSaveItemEdit = async (id: number, updatedValues: { name: string, note: string }) => {
    await handleApiAction(`http://localhost:3001/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedValues),
    });
    setIsEditModalOpen(false);
  };
  
  // --- LOGIKA FILTER & SORT ---
  const requestSort = (key: keyof Item | '#') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const processedItems = useMemo(() => {
    let processableItems = items.filter(item => {
      const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
      const locationMatch = locationFilter === 'All' || item.location === locationFilter;
      return categoryMatch && locationMatch;
    });

    if (sortConfig !== null) {
      processableItems = [...processableItems].sort((a, b) => {
        if (sortConfig.key !== '#') {
          const key = sortConfig.key as keyof Item;
          if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    if (sortConfig?.key === '#' && sortConfig.direction === 'descending') {
        return processableItems.reverse();
    }
    return processableItems;
  }, [items, categoryFilter, locationFilter, sortConfig]);

  const itemsInBagCount = useMemo(() => {
    return items.filter(item => item && item.location === 'Bag').length;
  }, [items]);

  // --- IKON & RENDER ---
  const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg"><LogoIcon /></div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pulang Pergi</h1>
          </div>
          <button onClick={() => setView(view === 'main' ? 'settings' : 'main')} title="Pengaturan" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <SettingsIcon />
          </button>
        </header>

        <main>
          {view === 'settings' ? (
            <SettingsPage 
              categories={categories}
              locations={locations}
              onCategoryUpdate={handleCategoryUpdate}
              onLocationUpdate={handleLocationUpdate}
              onBack={() => setView('main')}
            />
          ) : (
            <>
              {!showAddForm && (
                <div className="mb-6 text-right">
                  <button onClick={() => setShowAddForm(true)} className="px-5 py-2.5 text-sm font-semibold rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700">
                    + Tambah Barang Baru
                  </button>
                </div>
              )}
              {showAddForm && <AddItemForm categories={categories} locations={locations} onAddItem={handleAddItem} onCancel={() => setShowAddForm(false)} />}

              <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 mt-6">
                <FilterControls
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  locationFilter={locationFilter}
                  setLocationFilter={setLocationFilter}
                  onMoveAllFromBagClick={() => setIsMoveModalOpen(true)}
                  itemsInBagCount={itemsInBagCount}
                  categories={categories.map(c => c.name)}
                  locations={locations.map(l => l.name)}
                />
                <div className="mt-6">
                  <ItemTable 
                    items={processedItems} 
                    onUpdateItem={handleUpdateItem} 
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                    categories={categories}
                    locations={locations}
                    requestSort={requestSort}
                    sortConfig={sortConfig}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      
      <MoveItemsDialog
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onConfirm={handleMoveAllFromBag}
        itemCount={itemsInBagCount}
        locations={locations.map(l => l.name)}
      />

      {/* Modal Edit Baru */}
      <EditItemDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveItemEdit}
        item={editingItem}
      />
    </div>
  );
};

export default App;
