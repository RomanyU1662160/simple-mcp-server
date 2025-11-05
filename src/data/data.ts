export type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  phone: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
};

export type Order = {
  id: number;
  userId: number;
  products: { productId: number; quantity: number }[];
  status: "processing" | "shipped" | "delivered" | "cancelled";
};

export const users: User[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    isActive: true,
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    isActive: true,
    phone: "987-654-3210",
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    isActive: true,
    phone: "555-555-5555",
  },
  {
    id: 4,
    name: "David",
    email: "david@example.com",
    isActive: false,
    phone: "444-444-4444",
  },
  {
    id: 5,
    name: "Eve",
    email: "eve@example.com",
    isActive: true,
    phone: "333-333-3333",
  },
];

export const products: Product[] = [
  { id: 1, name: "Laptop", price: 999.99 },
  { id: 2, name: "Smartphone", price: 699.99 },
  { id: 3, name: "Tablet", price: 399.99 },
];

export const orders: Order[] = [
  {
    id: 1,
    userId: 1,
    products: [{ productId: 2, quantity: 1 }],
    status: "shipped",
  },
  {
    id: 2,
    userId: 2,
    products: [{ productId: 1, quantity: 2 }],
    status: "processing",
  },
  {
    id: 3,
    userId: 3,
    products: [{ productId: 3, quantity: 1 }],
    status: "delivered",
  },
];
