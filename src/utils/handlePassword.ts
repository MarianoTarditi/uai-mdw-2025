import bcrypt from "bcryptjs";
/*
    El passwordPlain se pasa por un algoritmo de hashing (bcrypt).
    El resultado es irreversible (no se puede volver a la contraseña original).
    Sirve para guardar contraseñas de forma segura.

    Esto sí es protección fuerte porque aunque alguien robe la DB, no puede obtener las contraseñas originales fácilmente.
*/

const encrpytPassword = async (passwordPlain: string) => {
  const hash = await bcrypt.hash(passwordPlain, 10);
  return hash;
};

const comparePassword = async (passwordPlain: string, hashPassword: string) => {
  return await bcrypt.compare(passwordPlain, hashPassword);
};

export default {
  encrpytPassword,
  comparePassword,
};
