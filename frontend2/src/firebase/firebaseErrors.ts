import { FirebaseError } from "firebase/app";

export function getFirebaseLoginErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
        return "Email y/o contraseña incorrectos, por favor intenta de nuevo.";

      case "auth/user-not-found":
        return "Email y/o contraseña incorrectos, por favor intenta de nuevo.";

      case "auth/wrong-password":
        return "Email y/o contraseña incorrectos, por favor intenta de nuevo.";

      case "auth/invalid-email":
        return "El formato del correo es inválido.";

      case "auth/weak-password":
        return "Demasiados intentos fallidos. Por favor intenta de nuevo más tarde.";

      case "auth/network-request-failed":
        return "Error de red. Por favor verifica tu conexión a internet.";

      default:
        return "Ocurrió un error inesperado. Por favor intenta de nuevo.";
    }
  }
  console.log(error);
  return "Error desconocido.";
}

export function getFirebaseRegisterError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Este correo ya está en uso. Por favor utiliza otro.";

      case "auth/invalid-email":
        return "La dirección de correo proporcionada es inválida.";

      case "auth/weak-password":
        return "La contraseña es muy débil. Por favor elige una más segura.";

      case "auth/operation-not-allowed":
        return "El registro con correo y contraseña no está habilitado.";

      case "auth/network-request-failed":
        return "Error de red. Por favor verifica tu conexión a internet.";

      case "auth/too-many-requests":
        return "Demasiados intentos. Por favor intenta de nuevo más tarde.";

      case "auth/missing-email":
        return "Se requiere una dirección de correo.";

      case "auth/missing-password":
        return "Se requiere una contraseña.";

      case "auth/internal-error":
        return "Ocurrió un error inesperado. Por favor intenta de nuevo.";

      default:
        return "Ocurrió un error desconocido. Por favor intenta de nuevo.";
    }
  }

  return "Ocurrió un error desconocido.";
}
