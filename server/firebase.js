
const path = require("path");
const fs = require("fs");

const {
  initializeApp,
  cert,
  getApps
} = require("firebase-admin/app");

const {
  getFirestore
} = require("firebase-admin/firestore");

function getCredentials() {
  // Render production: read credentials from environment variable.
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString("utf8");

    return JSON.parse(decoded);
  }

  // Local development: use the private key file.
  const keyPath = path.join(
    __dirname,
    "serviceAccountKey.json"
  );

  if (fs.existsSync(keyPath)) {
    return require(keyPath);
  }

  throw new Error(
    "Firebase credentials are missing. Configure FIREBASE_SERVICE_ACCOUNT_BASE64 on Render or provide server/serviceAccountKey.json locally."
  );
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(getCredentials())
      });

const db = getFirestore(app);

module.exports = { app, db };
