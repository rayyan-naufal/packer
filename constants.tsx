import { Item } from './types';

// Data awal ini bisa Anda hapus atau biarkan untuk referensi.
export const INITIAL_ITEMS: Item[] = [
  { id: 1, name: 'MacBook Pro', category: 'Gadgets', location: 'Bag', note: 'Includes charger' },
  { id: 2, name: 'Sony A7 IV', category: 'Camera', location: 'House', note: 'With 24-70mm lens' },
  { id: 3, name: 'Hoodie', category: 'Apparel', location: 'Dorm', note: 'Gray Nike hoodie' },
];

// Objek warna untuk Kategori (ini bisa tetap statis)
export const CATEGORY_COLORS: { [key: string]: string } = {
  'Apparel': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Personal': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Gadgets': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Camera': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

// === BAGIAN YANG DIPERBARUI ===

// 1. Hapus LOCATION_COLORS yang lama

// 2. Buat Palet Warna baru untuk Lokasi
const LOCATION_COLOR_PALETTE = [
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
  'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300',
];

// 3. Buat Fungsi Generator Warna
// Fungsi ini akan selalu menghasilkan warna yang sama untuk string yang sama.
export const generateColorFromString = (str: string): string => {
  if (!str) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // Warna default
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Konversi ke integer 32bit
  }
  const index = Math.abs(hash % LOCATION_COLOR_PALETTE.length);
  return LOCATION_COLOR_PALETTE[index];
};


export const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <path d="m9 10-2 2 2 2"></path>
        <path d="m15 10 2 2-2 2"></path>
    </svg>
);
