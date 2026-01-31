import multer from "multer";
import path from "path";
import fs from "fs";

// --- 1. CONFIGURACIÓN PARA IMÁGENES DE PERFIL ---
const profileDir = path.join(process.cwd(), "uploads", "profileImages");
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${Date.now()}${ext}`);
  },
});

export const uploadProfileImage = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB para fotos
  fileFilter: (req, file, cb) => {
    // Aceptamos solo imágenes
    if (file.mimetype.startsWith("image/")) cb(null, true);
  }
});

// --- 2. CONFIGURACIÓN PARA VIDEOS DE EJERCICIOS (NUEVO) ---
const videoDir = path.join(process.cwd(), "uploads", "exerciseVideos");
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videoDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Prefijo 'exercise-'
    cb(null, `exercise-${Date.now()}${ext}`);
  },
});

export const uploadExerciseVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB (Ajusta según necesites)
  fileFilter: (req, file, cb) => {
    // Aceptamos solo videos
    if (file.mimetype.startsWith("video/")) cb(null, true);
  }
});