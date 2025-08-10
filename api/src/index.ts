import dotenv from "dotenv";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/authRoutes.ts";
import SupabaseRouter from "./routes/supabaseRoutes.ts";
import ListingRouter from "./routes/listingRoutes.ts";
import { setupSwagger } from "./utils/swaggerUi.ts";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:4000"],
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use("/api", AuthRouter);
app.use("/api", SupabaseRouter);
app.use("/api", ListingRouter);

setupSwagger(app);
const port = process.env.PORT || 4000;
const host = process.env.HOST;

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to the spicarr coding");
});

app.listen(port, () => {
  console.log(`server is running at http://${host}:${port}`);
});
