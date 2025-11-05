import { Request, Response, Router } from "express";
import { orders, type Order } from "../data/data";

const ordersRouter: Router = Router();

ordersRouter.get("/", (_req: Request, res: Response<Order[]>) => {
  res.status(200).json(orders);
});

ordersRouter.get(
  "/:orderid",
  (req: Request, res: Response<Order | { message: string }>) => {
    if (!req.params.orderid) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const orderId = parseInt(req.params.orderid!, 10);
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      return res.status(200).json(order);
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  },
);

ordersRouter.post(
  "/",
  (req: Request, res: Response<Order | { message: string }>) => {
    const { userId, productId, quantity } = req.body ?? {};
    if (
      userId === undefined ||
      productId === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedUserId = Number(userId);
    const parsedProductId = Number(productId);
    const parsedQuantity = Number(quantity);
    if (
      !Number.isFinite(parsedUserId) ||
      !Number.isFinite(parsedProductId) ||
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return res.status(400).json({ message: "Invalid field values" });
    }

    const newOrder: Order = {
      id: orders.length + 1,
      userId: parsedUserId,
      products: [{ productId: parsedProductId, quantity: parsedQuantity }],
      status: "processing",
    };
    orders.push(newOrder);
    return res.status(201).json(newOrder);
  },
);

export default ordersRouter;
