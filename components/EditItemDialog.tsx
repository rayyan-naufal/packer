import React, { useState, useEffect } from 'react';
import { Item } from '../types';

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updatedValues: { name: string, note: string }) => void;
  item: Item | null;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({ isOpen, onClose, onSave, item }) => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    // Isi form dengan data item saat dialog dibuka
    if (item) {
      setName(item.name);
      setNote(item.note);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSave = () => {
    if (!name) {
      alert('Nama barang tidak boleh kosong.');
      return;
    }
    onSave(item.id, { name, note });
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Edit Barang</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="editItemName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nama Barang
            </label>
            <input
              type="text"
              id="editItemName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600"
              required
            />
          </div>
          <div>
            <label htmlFor="editItemNote" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Catatan (Opsional)
            </label>
            <textarea
              id="editItemNote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">
                Batal
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700">
                Simpan Perubahan
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemDialog;
