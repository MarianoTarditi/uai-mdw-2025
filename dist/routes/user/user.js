"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const router = express_1.default.Router();
router.post("/", controller_1.default.createUser);
router.get("/", controller_1.default.getUsers);
router.get("/:id", controller_1.default.getUserById);
router.put("/:id", controller_1.default.updateUser);
router.delete("/:id", controller_1.default.deleteUser);
exports.default = router;
