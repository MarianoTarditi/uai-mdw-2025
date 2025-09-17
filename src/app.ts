import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/server";
import router from "./routes";
import { handleJsonError } from "./middlewares/handleJsonValidator";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "http://localhost:5173", // o el puerto donde corre React
  credentials: true
}));

app.use(express.json());
app.use(handleJsonError)

app.get("/", (req, res) => {
  res.send("Server is ON");
});

app.use("/api", router);

try {
  app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
} catch (error) {
  console.log("Error starting server: ", error);
}
