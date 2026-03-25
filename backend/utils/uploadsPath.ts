import path from "path";
import fs from "fs";

const resolveDefaultUploadsDir = () => {
  const fromEnv = process.env.UPLOADS_DIR;
  if (fromEnv) return path.resolve(fromEnv);

  const cwdUploads = path.join(process.cwd(), "uploads");
  const cwdBackendUploads = path.join(process.cwd(), "backend", "uploads");

  // If running from project root, prefer ./backend/uploads when it exists.
  if (fs.existsSync(cwdBackendUploads)) return cwdBackendUploads;
  if (fs.existsSync(cwdUploads)) return cwdUploads;

  // Fallback keeps behavior predictable and creates ./backend/uploads by default from root.
  return cwdBackendUploads;
};

export const UPLOADS_DIR = resolveDefaultUploadsDir();

export const resolveUploadSubdir = (...segments: string[]) =>
  path.join(UPLOADS_DIR, ...segments);
