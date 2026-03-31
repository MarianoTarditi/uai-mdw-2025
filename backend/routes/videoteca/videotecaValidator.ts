import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import validateResults from "../../middlewares/handleValidator";

const mongoIdParam = (fieldName: string) =>
  param(fieldName)
    .exists()
    .withMessage(`${fieldName} is required`)
    .bail()
    .isMongoId()
    .withMessage(`${fieldName} must be a valid Mongo ID`);

const finalizeValidation = (req: Request, res: Response, next: NextFunction) => {
  validateResults(req, res, next);
};

export const listFolderAssetsValidator = [
  mongoIdParam("folderId"),
  finalizeValidation,
];

export const createFolderValidator = [
  body("name")
    .exists()
    .withMessage("Folder name is required")
    .bail()
    .isString()
    .withMessage("Folder name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Folder name must be 2-80 characters long"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .trim()
    .isLength({ max: 250 })
    .withMessage("Description must be up to 250 characters long"),
  body("order")
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer"),
  finalizeValidation,
];

export const updateFolderValidator = [
  mongoIdParam("folderId"),
  body("name")
    .optional()
    .isString()
    .withMessage("Folder name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Folder name must be 2-80 characters long"),
  body("description")
    .optional({ nullable: true })
    .custom((value) => value === null || typeof value === "string")
    .withMessage("Description must be a string or null")
    .bail()
    .custom((value) => value === null || value.trim().length <= 250)
    .withMessage("Description must be up to 250 characters long"),
  body("order")
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer"),
  body("coverAssetId")
    .optional({ nullable: true })
    .custom((value) => value === null || value === "" || typeof value === "string")
    .withMessage("coverAssetId must be a string or null")
    .bail()
    .custom((value) => value === null || value === "" || /^[a-f\d]{24}$/i.test(value))
    .withMessage("coverAssetId must be a valid Mongo ID"),
  finalizeValidation,
];

export const deleteFolderValidator = [
  mongoIdParam("folderId"),
  finalizeValidation,
];

export const uploadAssetValidator = [
  mongoIdParam("folderId"),
  body("name")
    .optional()
    .isString()
    .withMessage("Asset name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Asset name must be 2-120 characters long"),
  body("description")
    .optional({ nullable: true })
    .custom((value) => value === null || typeof value === "string")
    .withMessage("Description must be a string or null")
    .bail()
    .custom((value) => value === null || value.trim().length <= 240)
    .withMessage("Description must be up to 240 characters long"),
  finalizeValidation,
];

export const updateAssetValidator = [
  mongoIdParam("assetId"),
  body("name")
    .optional()
    .isString()
    .withMessage("Asset name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Asset name must be 2-120 characters long"),
  body("description")
    .optional({ nullable: true })
    .custom((value) => value === null || typeof value === "string")
    .withMessage("Description must be a string or null")
    .bail()
    .custom((value) => value === null || value.trim().length <= 240)
    .withMessage("Description must be up to 240 characters long"),
  body().custom((value) => {
    const hasName = typeof value?.name === "string" && value.name.trim().length > 0;
    const hasDescription = Object.prototype.hasOwnProperty.call(value ?? {}, "description");

    if (!hasName && !hasDescription) {
      throw new Error("Asset name or description is required");
    }

    return true;
  }),
  finalizeValidation,
];

export const replaceAssetValidator = [
  mongoIdParam("assetId"),
  body("name")
    .optional()
    .isString()
    .withMessage("Asset name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Asset name must be 2-120 characters long"),
  finalizeValidation,
];

export const deleteAssetValidator = [
  mongoIdParam("assetId"),
  finalizeValidation,
];
