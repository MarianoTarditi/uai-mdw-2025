import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/server";
import router from "./routes";
import { handleJsonError } from "./middlewares/handleJsonValidator";
import path from "path";
import { UPLOADS_DIR } from "./utils/uploadsPath";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "https://uai-mdw-2025.vercel.app",
];

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const finalAllowedOrigins =
  allowedOrigins.length > 0 ? allowedOrigins : defaultAllowedOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin (Postman/server-to-server/health checks)
      if (!origin) return callback(null, true);

      if (finalAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(handleJsonError);

app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/", (req, res) => {
  res.send("Server is ON");
});

app.use("/api", router);

try {
  app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    console.log(`Static files served at: ${UPLOADS_DIR}`);
  });
} catch (error) {
  console.log("Error starting server: ", error);
}
