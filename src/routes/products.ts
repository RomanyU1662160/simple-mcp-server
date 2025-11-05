import { Router, Request, Response } from "express";
import { products } from "../data/data";

const ProductsRouter: Router = Router();

ProductsRouter.get("/", (_req: Request, res: Response) => {
  res.status(200).json(products);
});

ProductsRouter.get("/:productid", (req: Request, res: Response) => {
  if (!req.params.productid) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  const product = products.find(
    (p) => p.id === parseInt(req.params.productid!),
  );
  if (product) {
    return res.status(200).json(product);
  } else {
    return res.status(404).json({ message: "Product not found" });
  }
});

ProductsRouter.post("/api/products/search", (req: Request, res: Response) => {
  const { query } = req.body;
  const results = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
  res.json(results);
});

export default ProductsRouter;
