import React, { useState, useEffect } from 'react';
import { Item } from '../types'; // Kita tidak butuh Location dari sini lagi

interface DataItem {
  id: number;
  name: string;
}

interface AddItemFormProps {
  categories: DataItem[];
  locations: DataItem[]; // Prop baru ditambahkan di sini
  onAddItem: (itemData: { name: string; category_id: number; location_id: number; note: string }) => void;
  onCancel: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ categories, locations, onAddItem, onCancel }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [locationId, setLocationId] = useState<number | ''>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (categoryId === '' && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    if (locationId === '' && locations.length > 0) {
      setLocationId(locations[0].id);
    }
  }, [categories, locations, categoryId, locationId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || categoryId === '' || locationId === '') {
      alert('Nama barang, kategori, dan lokasi tidak boleh kosong!');
      return;
    }
    onAddItem({ name, category_id: categoryId, location_id: locationId, note });
  };

  return (
    <div className="my-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Tambah Barang Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Nama Barang */}
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nama Barang
          </label>
          <input
            type="text"
            id="itemName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600"
            required
          />
        </div>

        {/* Pilihan Kategori */}
        <div>
          <label htmlFor="itemCategory" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Kategori
          </label>
          <select
            id="itemCategory"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600"
            disabled={categories.length === 0}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pilihan Lokasi */}
        <div>
          <label htmlFor="itemLocation" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Lokasi
          </label>
          <select
            id="itemLocation"
            value={locationId}
            onChange={(e) => setLocationId(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600"
            disabled={locations.length === 0}
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input Catatan */}
        <div>
          <label htmlFor="itemNote" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Catatan (Opsional)
          </label>
          <textarea
            id="itemNote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-blue-600 text-white shadow-md hover:bg-blue-700"
          >
            Tambah Barang
          </button>
        </div>
      </form>
    </div>
  );
};
