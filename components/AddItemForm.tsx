import React, { useState } from 'react';
import { Location } from '../types';
import { LOCATIONS } from '../constants';

// Tipe data yang dibutuhkan oleh form ini
interface AddItemFormProps {
  categories: { id: number; name: string }[];
  onAddItem: (itemData: { name: string; category_id: number; location: Location; note: string }) => void;
  onCancel: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ categories, onAddItem, onCancel }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>(categories.length > 0 ? categories[0].id : '');
  const [location, setLocation] = useState<Location>(Location.Bag);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || categoryId === '') {
      alert('Nama barang dan kategori tidak boleh kosong!');
      return;
    }
    onAddItem({ name, category_id: categoryId, location, note });
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
            value={location}
            onChange={(e) => setLocation(e.target.value as Location)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
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
