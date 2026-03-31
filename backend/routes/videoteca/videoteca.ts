import express from "express";
import multer from "multer";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import checkRole from "../../middlewares/checkRole";
import { UserRole } from "../../types";
import { uploadVideotecaAsset } from "../../utils/multer";
import handleHttpError from "../../utils/handleError";
import controllers from "./controller";
import {
  createFolderValidator,
  deleteAssetValidator,
  deleteFolderValidator,
  listFolderAssetsValidator,
  replaceAssetValidator,
  updateAssetValidator,
  updateFolderValidator,
  uploadAssetValidator,
} from "./videotecaValidator";

const router = express.Router();

const handleUpload =
  (fieldName: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    uploadVideotecaAsset.single(fieldName)(req, res, (error) => {
      if (!error) {
        return next();
      }

      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return handleHttpError(res, "Files cannot exceed 100MB", 400, error);
      }

      const message = error instanceof Error ? error.message : "Error uploading file";
      return handleHttpError(res, message, 400, error);
    });
  };

router.get(
  "/folders",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Student, UserRole.Admin]),
  controllers.listFolders,
);

router.post(
  "/folders",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  createFolderValidator,
  controllers.createFolder,
);

router.patch(
  "/folders/:folderId",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  updateFolderValidator,
  controllers.updateFolder,
);

router.delete(
  "/folders/:folderId",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  deleteFolderValidator,
  controllers.deleteFolder,
);

router.get(
  "/folders/:folderId/assets",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Student, UserRole.Admin]),
  listFolderAssetsValidator,
  controllers.listFolderAssets,
);

router.post(
  "/folders/:folderId/assets",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  uploadAssetValidator,
  handleUpload("file"),
  controllers.createAsset,
);

router.patch(
  "/assets/:assetId",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  updateAssetValidator,
  controllers.updateAsset,
);

router.put(
  "/assets/:assetId/file",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  replaceAssetValidator,
  handleUpload("file"),
  controllers.replaceAssetFile,
);

router.delete(
  "/assets/:assetId",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  deleteAssetValidator,
  controllers.deleteAsset,
);

export default router;
