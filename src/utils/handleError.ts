import { Response } from "express";

const handleHttpError = (res: Response, message: string, code: number, error?: unknown) => {
    res.status(code).json({ message, code, error: true });
}

export default handleHttpError;