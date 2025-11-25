import { FirebaseError } from "firebase/app";

export function getFirebaseLoginErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
        return "Email or password incorrect, please try again";

      case "auth/user-not-found":
        return "Email or password incorrect, please try again";

      case "auth/wrong-password":
        return "Email or password incorrect, please try again";

      case "auth/invalid-email":
        return "The email format is invalid.";

      case "auth/weak-password":
        return "Too many failed attempts. Please try again later.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
        
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }
  console.log(error);
  return "Unknown error.";
}

export function getFirebaseRegisterError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already in use. Please use a different one.";

      case "auth/invalid-email":
        return "The provided email address is invalid.";

      case "auth/weak-password":
        return "The password is too weak. Please choose a stronger one.";

      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled for this project.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      case "auth/missing-email":
        return "An email address is required.";

      case "auth/missing-password":
        return "A password is required.";

      case "auth/internal-error":
        return "An unexpected error occurred. Please try again.";

      default:
        return "An unknown error occurred. Please try again.";
    }
  }

  return "An unknown error occurred.";
}
