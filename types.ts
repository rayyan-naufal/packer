

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
