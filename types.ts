// Enum untuk Lokasi, ini sudah benar.
export enum Location {
  Bag = 'Bag',
  House = 'House',
  Dorm = 'Dorm',
}

// Interface untuk Item. Pastikan strukturnya seperti ini.
// Backend kita mengirim 'category' sebagai string, bukan 'category_id'.
export interface Item {
  id: number;
  name: string;
  category: string;
  location: Location;
  note: string;
}
