const { credential } = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("./service_account.json");

const admin = initializeApp({
  credential: credential.cert(serviceAccount),
});

const auth = getAuth();

module.exports = { admin, auth };
