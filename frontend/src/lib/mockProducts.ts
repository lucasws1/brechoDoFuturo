// src/lib/mockProducts.ts
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Camiseta Vintage",
    price: 49.9,
    image: "https://source.unsplash.com/random/300x300?clothes,1",
    category: "Masculino",
    description: "Camiseta retrô em algodão sustentável.",
  },
  {
    id: "2",
    name: "Vestido Floral",
    price: 89.9,
    image: "https://source.unsplash.com/random/300x300?clothes,2",
    category: "Feminino",
    description: "Vestido leve, perfeito para o verão.",
  },
  // ...adicione mais produtos!
];
