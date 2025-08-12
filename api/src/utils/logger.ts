import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

// Ensure logs directory exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat,
  ),
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat,
      ),
    }),
    // Daily Rotate File for INFO logs
    new DailyRotateFile({
      filename: path.join(logDir, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
    }),
    // Daily Rotate File for ERROR logs
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "error",
    }),
  ],
});
