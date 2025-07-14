
export enum Category {
  Apparel = 'Apparel',
  Personal = 'Personal',
  Gadgets = 'Gadgets',
  Camera = 'Camera',
}

export enum Location {
  Bag = 'Bag',
  House = 'House',
  Dorm = 'Dorm',
}

export interface Item {
  id: number;
  name: string;
  category: Category;
  location: Location;
  note: string;
}
