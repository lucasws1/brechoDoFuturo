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
    image: "https://picsum.photos/300/300?random=1",
    category: "Masculino",
    description: "Camiseta retrô em algodão sustentável.",
  },
  {
    id: "2",
    name: "Vestido Floral",
    price: 89.9,
    image: "https://picsum.photos/300/300?random=2",
    category: "Feminino",
    description: "Vestido leve, perfeito para o verão.",
  },
  {
    id: "3",
    name: "Calça Jeans Skinny",
    price: 129.9,
    image: "https://picsum.photos/300/300?random=3",
    category: "Feminino",
    description: "Calça jeans skinny de alta qualidade.",
  },
  {
    id: "4",
    name: "Blazer Casual",
    price: 199.9,
    image: "https://picsum.photos/300/300?random=4",
    category: "Masculino",
    description: "Blazer elegante para ocasiões especiais.",
  },
  {
    id: "5",
    name: "Saia Midi Plissada",
    price: 79.9,
    image: "https://picsum.photos/300/300?random=5",
    category: "Feminino",
    description: "Saia midi plissada, versátil e confortável.",
  },
  {
    id: "6",
    name: "Camisa Social",
    price: 149.9,
    image: "https://picsum.photos/300/300?random=6",
    category: "Masculino",
    description: "Camisa social de algodão egípcio.",
  },
  {
    id: "7",
    name: "Jaqueta Bomber",
    price: 179.9,
    image: "https://picsum.photos/300/300?random=7",
    category: "Unissex",
    description: "Jaqueta bomber estilo streetwear.",
  },
  {
    id: "8",
    name: "Blusa de Tricô",
    price: 99.9,
    image: "https://picsum.photos/300/300?random=8",
    category: "Feminino",
    description: "Blusa de tricô macia e aconchegante.",
  },
];
