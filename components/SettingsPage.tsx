import React from 'react';

interface DataItem {
  id: number;
  name: string;
}

interface ManagementListProps {
  title: string;
  items: DataItem[];
  onAdd: (name: string) => void;
  onUpdate: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
}

const ManagementList: React.FC<ManagementListProps> = ({ title, items, onAdd, onUpdate, onDelete }) => {
  const handleAdd = () => {
    const name = prompt(`Masukkan nama ${title} baru:`);
    if (name) onAdd(name);
  };

  const handleUpdate = (item: DataItem) => {
    const newName = prompt(`Edit nama ${title}:`, item.name);
    if (newName) onUpdate(item.id, newName);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
            <span>{item.name}</span>
            <div className="space-x-2">
              <button onClick={() => handleUpdate(item)} className="text-sm text-blue-500 hover:underline">Edit</button>
              <button onClick={() => onDelete(item.id)} className="text-sm text-red-500 hover:underline">Hapus</button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleAdd} className="mt-3 px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700">
        + Tambah {title}
      </button>
    </div>
  );
};


interface SettingsPageProps {
  categories: DataItem[];
  locations: DataItem[];
  onCategoryUpdate: (action: 'add' | 'update' | 'delete', data: { id?: number, name?: string }) => void;
  onLocationUpdate: (action: 'add' | 'update' | 'delete', data: { id?: number, name?: string }) => void;
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ categories, locations, onCategoryUpdate, onLocationUpdate, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-blue-500 hover:underline">
        &larr; Kembali ke Daftar Barang
      </button>
      <h2 className="text-3xl font-bold mb-6">Pengaturan</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <ManagementList 
          title="Kategori"
          items={categories}
          onAdd={(name) => onCategoryUpdate('add', { name })}
          onUpdate={(id, name) => onCategoryUpdate('update', { id, name })}
          onDelete={(id) => onCategoryUpdate('delete', { id })}
        />
        <ManagementList 
          title="Lokasi"
          items={locations}
          onAdd={(name) => onLocationUpdate('add', { name })}
          onUpdate={(id, name) => onLocationUpdate('update', { id, name })}
          onDelete={(id) => onLocationUpdate('delete', { id })}
        />
      </div>
    </div>
  );
};
