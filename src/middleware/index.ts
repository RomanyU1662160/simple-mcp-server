import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.http(`Received ${req.method} request for ${req.url} - IP ${req.ip}`);
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const logLevel = statusCode >= 400 ? "error" : "http";
    logger.log(
      logLevel,
      `Completed ${req.method} request for ${req.url} - IP ${req.ip} - Duration: ${duration}ms - Status: ${statusCode}`,
    );
  });

  next();
};

export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn(
    `404 Not Found: ${req.method} request for ${req.url} - IP ${req.ip}`,
  );
  res.status(404).json({
    error: "Root Not Found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
};

export const errorHandler = (err: Error, req: Request, res: Response) => {
  logger.error(
    `500 Internal Server Error: ${req.method} request for ${req.url} - IP ${req.ip} - Error: ${err.message}`,
  );
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred.",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
};
