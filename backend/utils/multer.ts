import multer from "multer";
import path from "path";
import fs from "fs";
import { resolveUploadSubdir } from "./uploadsPath";
import { getVideotecaTempDir, sanitizeFileName } from "./videotecaStorage";

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

const videotecaTempDir = getVideotecaTempDir();

const videotecaStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, videotecaTempDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName =
      sanitizeFileName(file.originalname.replace(ext, "")) || "videoteca-file";
    cb(null, `videoteca-${Date.now()}-${baseName}${ext.toLowerCase()}`);
  },
});

const allowedVideotecaMimes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export const uploadVideotecaAsset = multer({
  storage: videotecaStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedVideotecaMimes.has(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Only JPG, PNG, WEBP, GIF, MP4, WEBM or MOV files are allowed"),
    );
  },
});
