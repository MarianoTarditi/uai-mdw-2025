import admin from "firebase-admin";
import ServiceAccount from "../firebase-key.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      ServiceAccount as admin.ServiceAccount
    ),
  });
}

export default admin;
