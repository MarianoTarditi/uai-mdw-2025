import multer from "multer";
import path from "path";
import fs from "fs";
import { resolveUploadSubdir } from "./uploadsPath";

const profileDir = resolveUploadSubdir("profileImages");
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
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    return cb(new Error("Only image files are allowed"));
  }
});

const videoDir = resolveUploadSubdir("exerciseVideos");
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videoDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `exercise-${Date.now()}${ext}`);
  },
});

export const uploadExerciseVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) return cb(null, true);
    return cb(new Error("Only video files are allowed"));
  }
});

const routineTemplateDir = resolveUploadSubdir("routineTemplates");
if (!fs.existsSync(routineTemplateDir))
  fs.mkdirSync(routineTemplateDir, { recursive: true });

const routineTemplateStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, routineTemplateDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `routine-template-${Date.now()}${ext}`);
  },
});

const allowedTemplateMimes = new Set([
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export const uploadRoutineTemplate = multer({
  storage: routineTemplateStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTemplateMimes.has(file.mimetype)) return cb(null, true);
    return cb(new Error("Only PDF, XLS or XLSX files are allowed"));
  },
});
