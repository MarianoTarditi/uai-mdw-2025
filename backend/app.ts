import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/server";
import router from "./routes";
import { handleJsonError } from "./middlewares/handleJsonValidator";
import path from "path";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://uai-mdw-2025.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(handleJsonError);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Server is ON");
});

app.use("/api", router);

try {
  app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    console.log(
      `Static files served at: ${path.join(process.cwd(), "uploads")}`,
    );
  });
} catch (error) {
  console.log("Error starting server: ", error);
}
