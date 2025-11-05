import { Response, Request, Router } from "express";
import { startMcpServer } from "../mcp/server";
import logger from "../utils/logger";

const MCPRouter: Router = Router();

MCPRouter.get("/", (_req, res) => {
  res.status(200).json({ message: "MCP Router is working" });
});

MCPRouter.post("/", async (_req: Request, res: Response) => {
  try {
    // const { input } = req.body;
    await startMcpServer();
    logger.info("MCP Server started and listening on stdio transport");
    res.status(200).json({ message: "MCP Server started successfully" });
  } catch (error) {
    logger.error("Error connecting to MCP server:", error);
    res
      .status(500)
      .json({ message: `Internal Server Error:: ${(error as Error).message}` });
  }
});

export default MCPRouter;
