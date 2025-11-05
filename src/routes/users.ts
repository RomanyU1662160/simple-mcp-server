import { Request, Response, Router } from "express";
import { users, orders, Order, User } from "../data/data";

const usersRouter: Router = Router();

usersRouter.get("/", (_req: Request, res: Response<User[]>) => {
  res.status(200).json(users);
});

usersRouter.get(
  "/:userid",
  (req: Request, res: Response<User | { message: string }>) => {
    if (!req.params.userid) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = users.find((u) => u.id === parseInt(req.params.userid!));
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  },
);

usersRouter.post("/", (req: Request, res: Response) => {
  const newUser = { id: users.length + 1, ...req.body };

  users.push(newUser);
  res.status(201).json({ message: "User created successfully", user: newUser });
});

usersRouter.get("/:userid/orders", (req: Request, res: Response<Order[]>) => {
  const userOrders = orders.filter(
    (o) => o.userId === parseInt(req.params.userid!),
  );
  console.log("userOrders:::>>>", userOrders);
  return res.status(200).json(userOrders);
});
export default usersRouter;
