// packer-master/components/ItemTable.tsx
// ...
interface ItemTableProps {
  items: Item[];
  onUpdateItem: (id: number, updatedValues: Partial<Item>) => void;
  categories: { id: number; name: string }[]; // <-- Tambahkan props di sini
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onUpdateItem, categories }) => {
  // ...
  <tbody>
    {items.map((item, index) => (
      <ItemRow key={item.id} item={item} index={index} onUpdateItem={onUpdateItem} categories={categories} /> // <-- Oper props ke ItemRow
    ))}
  </tbody>
  // ...
};