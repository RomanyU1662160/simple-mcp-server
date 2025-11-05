import express from "express";
import logger from "./utils/logger";
import usersRouter from "./routes/users";
import healthRouter from "./routes/health";
import ProductsRouter from "./routes/products";
import MCPRouter from "./routes/mcp";
import cors from "cors";
import { requestLogger } from "./middleware";
import ordersRouter from "./routes/orders";

export const startServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.use("/api/users", usersRouter);
  app.use("/api/products", ProductsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/health", healthRouter);
  app.use("/mcp", MCPRouter);

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`🔗 API endpoints: http://localhost:${PORT}/api/users`);
    logger.info(`🔗 API endpoints: http://localhost:${PORT}/api/products`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    logger.info(`🔗 MCP endpoints: http://localhost:${PORT}/mcp`);
  });
};
