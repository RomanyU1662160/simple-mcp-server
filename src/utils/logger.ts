import * as winston from "winston";
import * as path from "path";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  verbose: "cyan",
  debug: "blue",
  silly: "grey",
};
winston.addColors(logColors);

const logFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  new winston.transports.Console({
    format: logFormat,
    stderrLevels: [
      "error",
      "warn",
      "info",
      "http",
      "verbose",
      "debug",
      "silly",
    ],
  }),
  new winston.transports.File({
    filename: path.join("logs", "error.log"),
    level: "error",
    format: logFormat,
  }),
  new winston.transports.File({
    filename: path.join("logs", "combined.log"),
    format: logFormat,
  }),
];

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || "info",
  transports,
});

export default logger;
