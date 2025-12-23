import multer from "multer";
import path from "path";
import fs from "fs"; // 👈 Importar el módulo File System

// Definir la ruta absoluta de destino
const uploadDir = path.join(process.cwd(), "uploads", "profileImages");

// Asegurarse de que el directorio exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // 'recursive: true' asegura que crea 'uploads' y 'profileImages'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usar la ruta absoluta ya verificada
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `user-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

export const uploadProfileImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
