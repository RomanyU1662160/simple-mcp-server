import { Router } from "express";
import logger from "../utils/logger";

const healthRouter: Router = Router();

healthRouter.get("/", (_req, res) => {
  logger.info("Health check endpoint called");
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
export default healthRouter;
