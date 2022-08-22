const { auth } = require("./firebase");

module.exports = {
  verifyAccessToken: (accessToken) =>
    auth
      .verifyIdToken(accessToken)
      .then((decodedToken) => decodedToken)
      .catch((error) => console.log(error)),
};
