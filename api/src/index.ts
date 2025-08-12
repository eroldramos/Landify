import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";
import type { Request, Response, NextFunction } from "express";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/authRoutes.ts";
import SupabaseRouter from "./routes/supabaseRoutes.ts";
import ListingRouter from "./routes/listingRoutes.ts";
import FavoriteRouter from "./routes/favoriteRoutes.ts";
import ImageRouter from "./routes/imageRoutes.ts";
import { setupSwagger } from "./utils/swaggerUi.ts";
import { logger } from "./utils/logger.ts";
dotenv.config();

const app = express();

// ------------------ ENV CONFIG ------------------
const ALLOWED_ORIGINS: string[] = process.env.ALLOWED_ORIGINS?.split(",").map(
  (o) => o.trim(),
) || ["http://localhost:4000"];

const ALLOWED_HOSTS: string[] =
  process.env.ALLOWED_HOSTS?.split(",").map((h) => h.trim()) || [];

// ------------------ LOGGER ------------------
interface Logger {
  info: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

// const logger: Logger = {
//   info: (...args) => console.log("[INFO]", ...args),
//   error: (...args) => console.error("[ERROR]", ...args),
// };

// ------------------ MIDDLEWARES ------------------

// CORS (Dynamic from ENV)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Access-Control-Allow-Origin",
    ],
    credentials: true,
  }),
);

// Security Headers (Helmet with CSP)
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        mediaSrc: ["'self'", "blob:"],
        imgSrc: ["'self'", "data:", "https://fastapi.tiangolo.com"],
      },
    },
    frameguard: { action: "deny" },
    xssFilter: true,
    noSniff: true,
    hsts: { maxAge: 31536000, includeSubDomains: true },
  }),
);

// Trusted Hosts
app.use((req: Request, res: Response, next: NextFunction) => {
  const host = req.hostname;
  if (ALLOWED_HOSTS.length && !ALLOWED_HOSTS.includes(host)) {
    return res
      .status(403)
      .json({ success: false, message: "Host not allowed" });
  }
  next();
});

// Custom Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime();
  const traceId = uuidv4();
  res.locals.traceId = traceId;

  res.on("finish", () => {
    const diff = process.hrtime(startTime);
    const processingTime = (diff[0] + diff[1] / 1e9).toFixed(7);
    logger.info(
      `TRACE_ID: ${traceId} - ${req.ip} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${processingTime}s`,
    );
  });

  next();
});

// ------------------ BODY PARSING ------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

// ------------------ ROUTES ------------------
app.use("/api", AuthRouter);
app.use("/api", SupabaseRouter);
app.use("/api", ListingRouter);
app.use("/api", FavoriteRouter);
app.use("/api", ImageRouter);

setupSwagger(app);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to the spicarr coding");
});

// ------------------ GLOBAL ERROR HANDLER ------------------
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const traceId = res.locals.traceId || uuidv4();
  logger.error(
    `TRACE_ID: ${traceId} - Error in ${req.method} ${req.originalUrl} - ${err.message}`,
    err,
  );

  res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
    trace_id: traceId,
    detail: err.message,
  });
});

// ------------------ START SERVER ------------------
const port = process.env.PORT || 4000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  logger.info(`server is running at http://${host}:${port}`);
});

module.exports = app;
