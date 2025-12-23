import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/server";
import router from "./routes";
import { handleJsonError } from "./middlewares/handleJsonValidator";
import path from "path"; 

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

// Obtener el directorio base de la aplicación (esto es necesario para rutas absolutas)
// __dirname funciona si estás usando CommonJS o si usas TypeScript/ESM con configuración
// que emula __dirname. Si estás usando ES Modules nativo (import/export),
// es mejor usar path.resolve o process.cwd() para encontrar la raíz.
const currentDir = path.resolve(__dirname, '..'); // Ajusta la ruta si es necesario

app.use(express.json());
app.use(handleJsonError)
app.use('/uploads', express.static(path.join(currentDir, 'uploads'))); 

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
