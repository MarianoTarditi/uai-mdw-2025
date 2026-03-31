import fs from "fs";
import path from "path";
import { resolveUploadSubdir, UPLOADS_DIR } from "./uploadsPath";

const VIDEOTECA_ROOT = "videoteca";
const TEMP_DIR = "_tmp";
const TRASH_DIR = "_trash";

export const getVideotecaRootDir = () => resolveUploadSubdir(VIDEOTECA_ROOT);

export const ensureDirectory = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

export const sanitizeFileName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

export const slugifyFolderName = (name: string) => {
  const safe = sanitizeFileName(name);
  return safe || `folder-${Date.now()}`;
};

export const getVideotecaTempDir = () => {
  const tempDir = path.join(getVideotecaRootDir(), TEMP_DIR);
  ensureDirectory(tempDir);
  return tempDir;
};

export const getVideotecaTrashDir = () => {
  const trashDir = path.join(getVideotecaRootDir(), TRASH_DIR);
  ensureDirectory(trashDir);
  return trashDir;
};

export const buildAssetStorageInfo = (params: {
  folderSlug: string;
  assetId: string;
  fileName: string;
  extension: string;
}) => {
  const safeSlug = slugifyFolderName(params.folderSlug);
  const safeName = sanitizeFileName(params.fileName) || "archivo";
  const normalizedExtension = params.extension.startsWith(".")
    ? params.extension.toLowerCase()
    : `.${params.extension.toLowerCase()}`;
  const folderDir = path.join(getVideotecaRootDir(), safeSlug);

  ensureDirectory(folderDir);

  const fileName = `${params.assetId}-${safeName}${normalizedExtension}`;
  const absolutePath = path.join(folderDir, fileName);
  const relativePath = path
    .relative(UPLOADS_DIR, absolutePath)
    .split(path.sep)
    .join("/");

  return {
    absolutePath,
    relativePath,
    publicUrl: `/uploads/${relativePath}`,
    folderDir,
  };
};

export const fileExists = (filePath: string) => fs.existsSync(filePath);

export const removeFileIfExists = (filePath: string) => {
  if (fileExists(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const removeDirectoryIfEmpty = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) {
    return;
  }

  const files = fs.readdirSync(directoryPath);
  if (files.length === 0) {
    fs.rmdirSync(directoryPath);
  }
};

export const removePathIfExists = (targetPath: string) => {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  fs.rmSync(targetPath, { recursive: true, force: true });
};

export const movePathToTrash = (sourcePath: string, trashPrefix: string) => {
  if (!fs.existsSync(sourcePath)) {
    return null;
  }

  const trashPath = path.join(
    getVideotecaTrashDir(),
    `${trashPrefix}-${Date.now()}-${path.basename(sourcePath)}`,
  );

  fs.renameSync(sourcePath, trashPath);
  return trashPath;
};

export const restorePathFromTrash = (trashPath: string, destinationPath: string) => {
  if (!fs.existsSync(trashPath)) {
    return;
  }

  ensureDirectory(path.dirname(destinationPath));
  fs.renameSync(trashPath, destinationPath);
};

export const moveDirectoryToTrash = (sourceDirectory: string, trashPrefix: string) => {
  if (!fs.existsSync(sourceDirectory)) {
    return null;
  }

  const trashDirectory = path.join(
    getVideotecaTrashDir(),
    `${trashPrefix}-${Date.now()}-${path.basename(sourceDirectory)}`,
  );

  fs.renameSync(sourceDirectory, trashDirectory);
  return trashDirectory;
};

export const resolvePublicUploadPath = (fileUrl: string) => {
  const relativeFilePath = fileUrl.replace(/^[/\\]*uploads[/\\]?/, "");
  return path.join(UPLOADS_DIR, relativeFilePath);
};
