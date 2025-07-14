// Perhatikan: 'Category' sudah dihapus dari baris import di bawah ini
import { Location, Item } from './types';

// Kita sudah tidak menggunakan array CATEGORIES statis lagi, jadi baris itu sudah dihapus.

//export const LOCATIONS: Location[] = [
//  Location.Bag,
//  Location.House,
//  Location.Dorm,
//];

// Data awal ini bisa Anda hapus atau biarkan untuk referensi.
// Aplikasi tidak akan menggunakannya lagi karena data item akan diambil dari database.
export const INITIAL_ITEMS: Item[] = [
  { id: 1, name: 'MacBook Pro', category: 'Gadgets', location: Location.Bag, note: 'Includes charger' },
  { id: 2, name: 'Sony A7 IV', category: 'Camera', location: Location.House, note: 'With 24-70mm lens' },
  { id: 3, name: 'Hoodie', category: 'Apparel', location: Location.Dorm, note: 'Gray Nike hoodie' },
  { id: 4, name: 'Toothbrush', category: 'Personal', location: Location.Bag, note: 'New one' },
  { id: 5, name: 'iPhone 15', category: 'Gadgets', location: Location.Bag, note: 'Personal phone' },
  { id: 6, name: 'AirPods Pro', category: 'Gadgets', location: Location.Dorm, note: '' },
  { id: 7, name: 'Jeans', category: 'Apparel', location: Location.House, note: 'Levi\'s' },
  { id: 8, name: 'Deodorant', category: 'Personal', location: Location.Bag, note: '' },
  { id: 9, name: 'Camera Charger', category: 'Camera', location: Location.House, note: 'Bring extra battery' },
  { id: 10, name: 'SSD Drive', category: 'Gadgets', location: Location.Bag, note: 'For project files' },
  { id: 11, name: 'Sweater', category: 'Apparel', location: Location.Dorm, note: 'Ugly christmas sweater' },
  { id: 12, name: 'Tripod', category: 'Camera', location: Location.House, note: 'Manfrotto' },
  { id: 13, name: 'Shampoo', category: 'Personal', location: Location.Dorm, note: 'Almost empty' },
];

// Objek warna ini masih bisa berguna, tapi perhatikan bahwa nama kategori sekarang
// adalah string biasa, bukan enum.
export const CATEGORY_COLORS: { [key: string]: string } = {
  'Apparel': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Personal': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Gadgets': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Camera': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export const LOCATION_COLORS: { [key in Location]: string } = {
  [Location.Bag]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  [Location.House]: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  [Location.Dorm]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
};

export const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <path d="m9 10-2 2 2 2"></path>
        <path d="m15 10 2 2-2 2"></path>
    </svg>
);
