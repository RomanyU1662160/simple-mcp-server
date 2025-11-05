import { Order, Product, products } from "../data/data";
import { ProductStructured } from "../mcp/server";

export function mapRawOrdersToStructured(orders: Order[]): {
  orderId: number;
  products: ProductStructured[];
}[] {
  return orders.map((order) => ({
    orderId: order.id,
    products: order.products.map((product) => {
      const productInfo = products.find((p) => p.id === product.productId);
      return {
        id: productInfo?.id,
        name: productInfo?.name,
        price: productInfo?.price,
        quantity: product.quantity,
        totalPrice: productInfo ? productInfo.price * product.quantity : 0,
      } as ProductStructured;
    }),
  }));
}

export function mapRawProductsToStructured(
  products: Product[],
): ProductStructured[] {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 0,
    totalPrice: 0,
  }));
}
