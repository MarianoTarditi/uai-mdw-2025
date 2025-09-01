"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
const createUser = async (req, res) => {
    try {
        const { name, lastName, email, isActive } = req.body;
        const user = new User_1.default({ name, lastName, isActive, email });
        await user.save();
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error,
        });
    }
};
const getUsers = async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({
            message: "Error getting users",
            error,
        });
    }
};
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            message: "Error getting user",
            error,
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Desestructura id desde los parámetros de ruta (/users/:id, :id)
        const { name, lastName, email, isActive } = req.body; // Desestructura los campos que podrían actualizarse desde el cuerpo de la petición
        const user = await User_1.default.findByIdAndUpdate(id, // busca por _id = id y actualiza con el objeto del medio.
        { name, lastName, email, isActive }, // son los campos a cambiar.
        { new: true } //  Mongoose devuelva el documento ya actualizado
        );
        if (!user) { // Si user es null, significa que no se encontró el usuario.
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user); // responde con el usuario actualizado en formato JSON
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error,
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error,
        });
    }
};
exports.default = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
