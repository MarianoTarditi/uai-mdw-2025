import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { Types } from "mongoose";
import VideoAsset from "../../models/VideoAsset";
import VideoFolder from "../../models/VideoFolder";
import handleHttpError from "../../utils/handleError";
import {
  buildAssetStorageInfo,
  moveDirectoryToTrash,
  movePathToTrash,
  getVideotecaRootDir,
  removePathIfExists,
  restorePathFromTrash,
  resolvePublicUploadPath,
  slugifyFolderName,
} from "../../utils/videotecaStorage";
import {
  getVideoDurationSeconds,
  MAX_VIDEO_DURATION_SECONDS,
} from "../../utils/videoMetadata";

type AuthenticatedRequest = Request & {
  dbUser?: {
    _id: Types.ObjectId | string;
    roles: string[];
  };
};

const EDITOR_ROLES = new Set(["trainer", "admin"]);

const isEditor = (req: AuthenticatedRequest) =>
  Boolean(req.dbUser?.roles?.some((role) => EDITOR_ROLES.has(role)));

const folderDto = async (folder: any) => {
  const assetCount = await VideoAsset.countDocuments({ folderId: folder._id });

  return {
    _id: String(folder._id),
    name: folder.name,
    slug: folder.slug,
    description: folder.description ?? null,
    coverImageUrl: folder.coverImageUrl ?? null,
    coverAssetId: folder.coverAssetId ? String(folder.coverAssetId) : null,
    order: folder.order ?? 0,
    assetCount,
    updatedAt: folder.updatedAt,
    createdAt: folder.createdAt,
  };
};

const assetDto = (asset: any) => ({
  _id: String(asset._id),
  folderId: String(asset.folderId),
  name: asset.name,
  description: asset.description ?? null,
  type: asset.type,
  fileUrl: asset.fileUrl,
  mimeType: asset.mimeType,
  fileSize: asset.fileSize,
  durationSeconds: asset.durationSeconds ?? null,
  originalName: asset.originalName,
  createdAt: asset.createdAt,
  updatedAt: asset.updatedAt,
});

const deriveAssetName = (providedName: unknown, originalName: string) => {
  if (typeof providedName === "string" && providedName.trim().length >= 2) {
    return providedName.trim();
  }

  return path.basename(originalName, path.extname(originalName)).trim();
};

const normalizeOptionalText = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
};

const syncFolderCover = async (folderId: string | Types.ObjectId) => {
  const folder = await VideoFolder.findById(folderId);
  if (!folder) {
    return null;
  }

  let nextCoverImageUrl: string | null = null;

  if (folder.coverAssetId) {
    const manualCoverAsset = await VideoAsset.findOne({
      _id: folder.coverAssetId,
      folderId: folder._id,
      type: "image",
    }).lean();

    if (manualCoverAsset) {
      nextCoverImageUrl = manualCoverAsset.fileUrl;
    } else {
      folder.coverAssetId = null as any;
    }
  }

  if (!nextCoverImageUrl) {
    const automaticCoverAsset = await VideoAsset.findOne({
      folderId: folder._id,
      type: "image",
    })
      .sort({ createdAt: 1 })
      .lean();

    nextCoverImageUrl = automaticCoverAsset?.fileUrl ?? null;
  }

  folder.coverImageUrl = nextCoverImageUrl;
  await folder.save();

  return folder;
};

const ensureFolderExists = async (folderId: string) => {
  const folder = await VideoFolder.findById(folderId);
  return folder;
};

const ensureAssetExists = async (assetId: string) => {
  const asset = await VideoAsset.findById(assetId);
  return asset;
};

const getParamValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value ?? "";

const validateVideoFile = async (filePath: string) => {
  const durationSeconds = await getVideoDurationSeconds(filePath);

  if (durationSeconds > MAX_VIDEO_DURATION_SECONDS) {
    throw new Error("Video must be 60 seconds or shorter");
  }

  return durationSeconds;
};

const resolveAssetType = (mimeType: string) =>
  mimeType.startsWith("video/") ? "video" : "image";

const listFolders = async (_req: Request, res: Response) => {
  try {
    const folders = await VideoFolder.find({})
      .sort({ order: 1, name: 1 })
      .lean();

    const data = await Promise.all(folders.map(folderDto));
    res.status(200).json({ data });
  } catch (error) {
    handleHttpError(res, "Error fetching videoteca folders", 500, error);
  }
};

const createFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requester = req.dbUser;

    if (!requester || !isEditor(req)) {
      return handleHttpError(res, "You do not have permission to create folders", 403);
    }

    const trimmedName = String(req.body.name).trim();
    let baseSlug = slugifyFolderName(trimmedName);
    let slug = baseSlug;
    let suffix = 0;

    while (await VideoFolder.exists({ slug })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const folder = await VideoFolder.create({
      name: trimmedName,
      slug,
      description:
        typeof req.body.description === "string" && req.body.description.trim()
          ? req.body.description.trim()
          : null,
      order: req.body.order ? Number(req.body.order) : 0,
      createdBy: requester._id,
      updatedBy: requester._id,
    });

    res.status(201).json({
      message: "Videoteca folder created successfully",
      data: await folderDto(folder),
    });
  } catch (error) {
    handleHttpError(res, "Error creating videoteca folder", 500, error);
  }
};

const updateFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requester = req.dbUser;

    if (!requester || !isEditor(req)) {
      return handleHttpError(res, "You do not have permission to update folders", 403);
    }

    const folder = await ensureFolderExists(getParamValue(req.params.folderId));

    if (!folder) {
      return handleHttpError(res, "Folder not found", 404);
    }

    if (typeof req.body.name === "string" && req.body.name.trim()) {
      folder.name = req.body.name.trim();
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
      folder.description =
        typeof req.body.description === "string" && req.body.description.trim()
          ? req.body.description.trim()
          : null;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "order")) {
      folder.order = Number(req.body.order) || 0;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "coverAssetId")) {
      const nextCoverAssetId =
        typeof req.body.coverAssetId === "string" && req.body.coverAssetId.trim()
          ? req.body.coverAssetId.trim()
          : null;

      if (nextCoverAssetId) {
        const coverAsset = await VideoAsset.findOne({
          _id: nextCoverAssetId,
          folderId: folder._id,
          type: "image",
        }).lean();

        if (!coverAsset) {
          return handleHttpError(
            res,
            "Selected cover asset must be an image from the same folder",
            400,
          );
        }

        folder.coverAssetId = new Types.ObjectId(nextCoverAssetId) as any;
      } else {
        folder.coverAssetId = null as any;
      }
    }

    folder.updatedBy = requester._id as any;
    await folder.save();
    const syncedFolder = await syncFolderCover(folder._id);

    res.status(200).json({
      message: "Videoteca folder updated successfully",
      data: await folderDto(syncedFolder ?? folder),
    });
  } catch (error) {
    handleHttpError(res, "Error updating videoteca folder", 500, error);
  }
};

const deleteFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requester = req.dbUser;

    if (!requester || !isEditor(req)) {
      return handleHttpError(res, "You do not have permission to delete folders", 403);
    }

    const folder = await ensureFolderExists(getParamValue(req.params.folderId));

    if (!folder) {
      return handleHttpError(res, "Folder not found", 404);
    }

    const assets = await VideoAsset.find({ folderId: folder._id }).lean();
    const folderDirectory = path.join(getVideotecaRootDir(), folder.slug);
    const trashDirectory = moveDirectoryToTrash(
      folderDirectory,
      `folder-${String(folder._id)}`,
    );
    const assetsSnapshot = assets.map((asset) => ({ ...asset }));
    let assetsDeleted = false;

    try {
      await VideoAsset.deleteMany({ folderId: folder._id });
      assetsDeleted = true;
      await VideoFolder.findByIdAndDelete(folder._id);
    } catch (error) {
      if (assetsDeleted && assetsSnapshot.length > 0) {
        try {
          await VideoAsset.insertMany(assetsSnapshot);
        } catch (_restoreError) {
          // Best effort restore: if Mongo reinsertion fails we still continue
          // restoring the filesystem so the admin can retry the delete cleanly.
        }
      }

      if (trashDirectory) {
        try {
          restorePathFromTrash(trashDirectory, folderDirectory);
        } catch (_restoreError) {
          // Best effort restore; a leftover trash directory is preferable to
          // leaving the live folder path in an inconsistent state.
        }
      }

      throw error;
    }

    if (trashDirectory) {
      try {
        removePathIfExists(trashDirectory);
      } catch (_cleanupError) {
        // If trash cleanup fails, the authoritative Mongo state is already deleted.
      }
    }

    res.status(200).json({ message: "Videoteca folder deleted successfully" });
  } catch (error) {
    handleHttpError(res, "Error deleting videoteca folder", 500, error);
  }
};

const listFolderAssets = async (req: Request, res: Response) => {
  try {
    const folder = await ensureFolderExists(getParamValue(req.params.folderId));

    if (!folder) {
      return handleHttpError(res, "Folder not found", 404);
    }

    const assets = await VideoAsset.find({ folderId: folder._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      data: {
        folder: await folderDto(folder),
        assets: assets.map(assetDto),
      },
    });
  } catch (error) {
    handleHttpError(res, "Error fetching folder assets", 500, error);
  }
};

const createAsset = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requester = req.dbUser;

    if (!requester || !isEditor(req)) {
      if (req.file?.path) {
        removePathIfExists(req.file.path);
      }

      return handleHttpError(res, "You do not have permission to upload assets", 403);
    }

    const folder = await ensureFolderExists(getParamValue(req.params.folderId));
    if (!folder) {
      if (req.file?.path) {
        removePathIfExists(req.file.path);
      }
      return handleHttpError(res, "Folder not found", 404);
    }

    if (!req.file) {
      return handleHttpError(res, "Asset file is required", 400);
    }

    const assetType = resolveAssetType(req.file.mimetype);
    const durationSeconds =
      assetType === "video" ? await validateVideoFile(req.file.path) : null;
    const assetName = deriveAssetName(req.body?.name, req.file.originalname);

    const asset = new VideoAsset({
      folderId: folder._id,
      name: assetName,
      description: normalizeOptionalText(req.body?.description, 240),
      type: assetType,
      fileUrl: "",
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      durationSeconds,
      originalName: req.file.originalname,
      uploadedBy: requester._id,
    });

    const storageInfo = buildAssetStorageInfo({
      folderSlug: folder.slug,
      assetId: String(asset._id),
      fileName: assetName,
      extension: path.extname(req.file.originalname),
    });

    fs.renameSync(req.file.path, storageInfo.absolutePath);

    asset.fileUrl = storageInfo.publicUrl;

    try {
      await asset.save();
    } catch (error) {
      removePathIfExists(storageInfo.absolutePath);
      throw error;
    }

    try {
      await syncFolderCover(folder._id);
    } catch (_error) {
      // Best effort: cover metadata should not block the successful replacement.
    }

    res.status(201).json({
      message: "Videoteca asset uploaded successfully",
      data: assetDto(asset),
    });
  } catch (error) {
    if (req.file?.path) {
      removePathIfExists(req.file.path);
    }

    const message =
      error instanceof Error ? error.message : "Error uploading videoteca asset";
    const statusCode =
      message === "Video must be 60 seconds or shorter" ? 400 : 500;

    handleHttpError(res, message, statusCode, error);
  }
};

const updateAsset = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requester = req.dbUser;

    if (!requester || !isEditor(req)) {
      return handleHttpError(res, "You do not have permission to update assets", 403);
    }

    const asset = await ensureAssetExists(getParamValue(req.params.assetId));
    if (!asset) {
      return handleHttpError(res, "Asset not found", 404);
    }

    if (typeof req.body.name === "string" && req.body.name.trim()) {
      asset.name = req.body.name.trim();
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
      asset.description = normalizeOptionalText(req.body.description, 240);
    }

    await asset.save();

    res.status(200).json({
      message: "Videoteca asset updated successfully",
      data: assetDto(asset),
    });
  } catch (error) {
    handleHttpError(res, "Error updating videoteca asset", 500, error);
  }
};

const replaceAssetFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requester = req.dbUser;

    if (!requester || !isEditor(req)) {
      if (req.file?.path) {
        removePathIfExists(req.file.path);
      }

      return handleHttpError(res, "You do not have permission to replace assets", 403);
    }

    const asset = await ensureAssetExists(getParamValue(req.params.assetId));

    if (!asset) {
      if (req.file?.path) {
        removePathIfExists(req.file.path);
      }
      return handleHttpError(res, "Asset not found", 404);
    }

    if (!req.file) {
      return handleHttpError(res, "Replacement file is required", 400);
    }

    const folder = await ensureFolderExists(String(asset.folderId));
    if (!folder) {
      removePathIfExists(req.file.path);
      return handleHttpError(res, "Folder not found", 404);
    }

    const nextType = resolveAssetType(req.file.mimetype);
    const durationSeconds =
      nextType === "video" ? await validateVideoFile(req.file.path) : null;
    const nextName = deriveAssetName(req.body?.name ?? asset.name, req.file.originalname);
    const storageInfo = buildAssetStorageInfo({
      folderSlug: folder.slug,
      assetId: String(asset._id),
      fileName: nextName,
      extension: path.extname(req.file.originalname),
    });
    const previousFileUrl = asset.fileUrl;
    const previousAbsolutePath = resolvePublicUploadPath(previousFileUrl);
    const previousBackupPath = movePathToTrash(
      previousAbsolutePath,
      `asset-${String(asset._id)}-backup`,
    );

    fs.renameSync(req.file.path, storageInfo.absolutePath);

    asset.name = nextName;
    asset.type = nextType;
    asset.fileUrl = storageInfo.publicUrl;
    asset.mimeType = req.file.mimetype;
    asset.fileSize = req.file.size;
    asset.durationSeconds = durationSeconds;
    asset.originalName = req.file.originalname;

    try {
      await asset.save();
    } catch (error) {
      removePathIfExists(storageInfo.absolutePath);
      if (previousBackupPath) {
        try {
          restorePathFromTrash(previousBackupPath, previousAbsolutePath);
        } catch (_restoreError) {
          // If restore fails, the next retry still has the trash backup to inspect.
        }
      }
      throw error;
    }

    if (previousBackupPath) {
      removePathIfExists(previousBackupPath);
    }

    try {
      await syncFolderCover(folder._id);
    } catch (_error) {
      // Best effort: cover metadata should not block the successful replacement.
    }

    res.status(200).json({
      message: "Videoteca asset replaced successfully",
      data: assetDto(asset),
    });
  } catch (error) {
    if (req.file?.path) {
      removePathIfExists(req.file.path);
    }

    const message =
      error instanceof Error ? error.message : "Error replacing videoteca asset";
    const statusCode =
      message === "Video must be 60 seconds or shorter" ? 400 : 500;

    handleHttpError(res, message, statusCode, error);
  }
};

const deleteAsset = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requester = req.dbUser;

    if (!requester || !isEditor(req)) {
      return handleHttpError(res, "You do not have permission to delete assets", 403);
    }

    const asset = await ensureAssetExists(getParamValue(req.params.assetId));
    if (!asset) {
      return handleHttpError(res, "Asset not found", 404);
    }

    const absolutePath = resolvePublicUploadPath(asset.fileUrl);
    const trashPath = movePathToTrash(
      absolutePath,
      `asset-${String(asset._id)}-delete`,
    );

    try {
      await VideoAsset.findByIdAndDelete(asset._id);
    } catch (error) {
      if (trashPath) {
        restorePathFromTrash(trashPath, absolutePath);
      }
      throw error;
    }

    try {
      await syncFolderCover(asset.folderId);
    } catch (_error) {
      // Best effort: cover metadata should not block the successful delete.
    }

    if (trashPath) {
      try {
        removePathIfExists(trashPath);
      } catch (_cleanupError) {
        // Keep request successful; leftover trash is safer than failing after delete.
      }
    }

    res.status(200).json({ message: "Videoteca asset deleted successfully" });
  } catch (error) {
    handleHttpError(res, "Error deleting videoteca asset", 500, error);
  }
};

export default {
  listFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  listFolderAssets,
  createAsset,
  updateAsset,
  replaceAssetFile,
  deleteAsset,
};
