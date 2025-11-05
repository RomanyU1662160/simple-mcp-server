// import logger from '../utils/logger';

import { Order, User } from "../data/data";

const APP_BaseURL = "http://localhost:3000/api";

export const UsersService = {
  getUserById: async (id: string) => {
    const response = await fetch(`${APP_BaseURL}/users/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return (await response.json()) as User;
  },
  getUserOrders: async (userId: string) => {
    const response = await fetch(`${APP_BaseURL}/users/${userId}/orders`);
    if (!response.ok) {
      throw new Error("Failed to fetch user orders");
    }
    const result = await response.json();
    console.log("Response", JSON.stringify(result));
    return result as Order[];
  },
  getUsers: async () => {
    const response = await fetch(`${APP_BaseURL}/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return (await response.json()) as User[];
  },
  createOrder: async (
    userId: string,
    products: { productId: number; quantity: number }[],
  ) => {
    const response = await fetch(`${APP_BaseURL}/users/${userId}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products }),
    });
    if (!response.ok) {
      throw new Error("Failed to create order");
    }
    return (await response.json()) as Order;
  },
};
