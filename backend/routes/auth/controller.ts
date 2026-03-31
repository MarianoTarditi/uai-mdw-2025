import handleHttpError from "../../utils/handleError";
import { Request, Response } from "express";

const saveUser = async (req: Request, res: Response) => {
  try {
    return handleHttpError(
      res,
      "El auto-registro est? deshabilitado. Solicita el alta a un administrador o trainer.",
      403,
    );
  } catch (error) {
    console.log(error);
    return handleHttpError(res, "Error while registering user", 500);
  }
};

export default { saveUser };
