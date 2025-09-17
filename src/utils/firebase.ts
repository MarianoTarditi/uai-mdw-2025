import admin from "firebase-admin";
import ServiceAccount from "../firebase-api-key.json";

admin.initializeApp({
  credential: admin.credential.cert(ServiceAccount as admin.ServiceAccount),
});

export default admin;