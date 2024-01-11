var admin = require("firebase-admin");
var serviceAccount = require("./adlonapp-firebase-adminsdk.json");

admin.initializeApp({
  apiKey: "AIzaSyBBn8AeBAy169rfbrUHlwLvRek-dH0_Vck", //AIzaSyAXYZEEY8ooRIwvcnkDSkxOVTew-fpqDvg
  authDomain: "localhost",
  credential: admin.credential.cert(serviceAccount),
  projectId: "adlonapp",
  storageBucket: process.env.FIREBASE_IMAGE_UPLOAD_URL,
});

module.exports.admin = admin;
